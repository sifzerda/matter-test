import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Events, Composite, Composites, MouseConstraint, Mouse, Bodies } from 'matter-js';

const CompositeManipulation = () => {
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

        // Add walls
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // Create stack of bodies
        const stack = Composites.stack(200, 200, 4, 4, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, 40, 40);
        });

        Composite.add(world, stack);

        engine.gravity.y = 0;

        // Handle composite manipulation
        Events.on(engine, 'afterUpdate', event => {
            const time = engine.timing.timestamp;
            const timeScale = (event.delta || (1000 / 60)) / 1000;

            Composite.translate(stack, {
                x: Math.sin(time * 0.001) * 10 * timeScale,
                y: 0
            });

            Composite.rotate(stack, Math.sin(time * 0.001) * 0.75 * timeScale, {
                x: 300,
                y: 300
            });

            const scale = 1 + (Math.sin(time * 0.001) * 0.75 * timeScale);

            Composite.scale(stack, scale, scale, {
                x: 300,
                y: 300
            });
        });

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
            <div ref={canvasRef} />
        </div>
    );
};

export default CompositeManipulation;