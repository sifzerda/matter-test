import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

// Define the GravityExample component
const GravityExample = () => {
    // Reference for the canvas element
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
                showVelocity: true,
                showAngleIndicator: true
            }
        });

        // Run the renderer
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // Set gravity
        engine.gravity.y = -1;

        // Create stack of bodies with random shapes and sizes
        const stack = Composites.stack(50, 120, 11, 5, 0, 0, (x, y) => {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
                    }
                case 1:
                    return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 50));
                default:
                    return Bodies.rectangle(x, y, 40, 40); // Fallback shape
            }
        });

        Composite.add(world, stack);

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

    // Render the canvas container
    return (
        <div ref={canvasRef} />
    );
};

export default GravityExample;