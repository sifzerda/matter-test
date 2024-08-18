import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Body, Composite, MouseConstraint, Mouse, Constraint, Bodies } from 'matter-js';

const NewtonsCradle = () => {
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
                showVelocity: true
            }
        });

        // Run the renderer
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Define the newtonsCradle function
        const createNewtonsCradle = (xx, yy, number, size, length) => {
            const newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

            for (let i = 0; i < number; i++) {
                const separation = 1.9;
                const circle = Bodies.circle(xx + i * (size * separation), yy + length, size, {
                    inertia: Infinity,
                    restitution: 1,
                    friction: 0,
                    frictionAir: 0,
                    slop: size * 0.02
                });
                const constraint = Constraint.create({
                    pointA: { x: xx + i * (size * separation), y: yy },
                    bodyB: circle
                });

                Composite.addBody(newtonsCradle, circle);
                Composite.addConstraint(newtonsCradle, constraint);
            }

            return newtonsCradle;
        };

        // Add Newton's Cradle setups
        let cradle = createNewtonsCradle(280, 100, 5, 30, 200);
        Composite.add(world, cradle);
        Body.translate(cradle.bodies[0], { x: -180, y: -100 });

        cradle = createNewtonsCradle(280, 380, 7, 20, 140);
        Composite.add(world, cradle);
        Body.translate(cradle.bodies[0], { x: -140, y: -100 });

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(world, mouseConstraint);
        render.mouse = mouse;

        // Fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 50 },
            max: { x: 800, y: 600 }
        });

        // Cleanup function
        return () => {
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default NewtonsCradle;