import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composites, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

const CircleStack = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Create engine
        const engine = Engine.create();
        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const stack = Composites.stack(100, 600 - 21 - 20 * 20, 10, 10, 20, 0, (x, y) => {
            return Bodies.circle(x, y, 20);
        });

        Composite.add(world, [
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
            stack
        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        // Cleanup function
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Composite.remove(world, mouseConstraint);
        };
    }, []);

    return (
        <div>
            <div ref={canvasRef} />
        </div>
    );
};

export default CircleStack;