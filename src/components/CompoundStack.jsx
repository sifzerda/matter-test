import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Body, Composites, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

const CompoundStack = () => {
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
                showAngleIndicator: true
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const size = 50;

        const stack = Composites.stack(100, 600 - 17 - size * 6, 12, 6, 0, 0, (x, y) => {
            const partA = Bodies.rectangle(x, y, size, size / 5);
            const partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render });

            return Body.create({
                parts: [partA, partB]
            });
        });

        Composite.add(world, [
            stack,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(400, 609, 800, 50, { isStatic: true })
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
        };
    }, []);

    return (
        <div>
            <div className='game-window' ref={canvasRef} />
        </div>
    );
};

export default CompoundStack;