import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

// Define the FrictionExample component
const FrictionExample = () => {
    // Reference for the canvas element
    const canvasRef = useRef(null);

    useEffect(() => {
        // Destructure the necessary Matter.js modules

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
                showVelocity: true
            }
        });

        // Run the renderer
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies with different friction settings
        Composite.add(world, [
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        Composite.add(world, [
            Bodies.rectangle(300, 180, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(300, 70, 40, 40, { friction: 0.001 })
        ]);

        Composite.add(world, [
            Bodies.rectangle(300, 350, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(300, 250, 40, 40, { friction: 0.0005 })
        ]);

        Composite.add(world, [
            Bodies.rectangle(300, 520, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(300, 430, 40, 40, { friction: 0 })
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
        <div className='game-window' ref={canvasRef} />
    );
};

export default FrictionExample;