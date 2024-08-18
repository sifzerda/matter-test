import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const WreckingBallDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const {
            Engine,
            Render,
            Runner,
            Composites,
            MouseConstraint,
            Mouse,
            Composite,
            Constraint,
            Bodies
        } = Matter;

        // Create the Matter.js engine
        const engine = Engine.create();
        const world = engine.world;

        // Create the Matter.js renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
                wireframes: true,
                background: '#ffffff'
            }
        });

        Render.run(render);

        // Create the runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies to the world
        const rows = 10;
        const yy = 600 - 25 - 40 * rows;

        const stack = Composites.stack(400, yy, 5, rows, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, 40, 40);
        });

        Composite.add(world, [
            stack,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        const ball = Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005 });
        Composite.add(world, ball);

        const ballConstraint = Constraint.create({
            pointA: { x: 300, y: 100 },
            bodyB: ball
        });
        Composite.add(world, ballConstraint);

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

    return (
        <div
            ref={canvasRef}
            style={{ width: '800px', height: '600px', border: '1px solid #000' }}
        />
    );
};

export default WreckingBallDemo;