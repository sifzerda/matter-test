import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composites, Constraint, MouseConstraint, Mouse, Composite, Bodies, Body, Vector } from 'matter-js';

const Catapult = () => {
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

        // Add bodies
        const group = Body.nextGroup(true);

        const stack = Composites.stack(250, 255, 1, 6, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, 30, 30);
        });

        const catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

        Composite.add(world, [
            stack,
            catapult,
            Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(250, 555, 20, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),
            Bodies.circle(560, 100, 50, { density: 0.005 }),
            Constraint.create({
                bodyA: catapult,
                pointB: Vector.clone(catapult.position),
                stiffness: 1,
                length: 0,
            }),
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
            Composite.remove(world, mouseConstraint);
        };
    }, []);

    return (
        <div>
            <div ref={canvasRef} />
        </div>
    );
};

export default Catapult;