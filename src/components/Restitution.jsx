import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Bodies, MouseConstraint, Mouse } from 'matter-js';

const RestitutionDemo = () => {
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
                showCollisions: true,
                showVelocity: true,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies with restitution
        const restitution = 0.9;
        const space = 600 / 5;

        Composite.add(world, [
            Bodies.rectangle(100 + space * 0, 150, 50, 50, { restitution }),
            Bodies.rectangle(100 + space * 1, 150, 50, 50, { restitution, angle: -Math.PI * 0.15 }),
            Bodies.rectangle(100 + space * 2, 150, 50, 50, { restitution, angle: -Math.PI * 0.25 }),
            Bodies.circle(100 + space * 3, 150, 25, { restitution }),
            Bodies.rectangle(100 + space * 5, 150, 180, 20, { restitution, angle: -Math.PI * 0.5 }),
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });

        Composite.add(world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 },
        });

        // Cleanup function
        return () => {
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef}/>
    );
};

export default RestitutionDemo;