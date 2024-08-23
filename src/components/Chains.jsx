import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Body, Composite, Composites, Constraint, MouseConstraint, Mouse, Bodies } from 'matter-js';

const Chains = () => {
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
                showVelocity: true
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        let group = Body.nextGroup(true);

        const ropeA = Composites.stack(100, 50, 8, 1, 10, 10, (x, y) => {
            return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
        });

        Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
        Composite.add(ropeA, Constraint.create({
            bodyB: ropeA.bodies[0],
            pointB: { x: -25, y: 0 },
            pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
            stiffness: 0.5
        }));

        group = Body.nextGroup(true);

        const ropeB = Composites.stack(350, 50, 10, 1, 10, 10, (x, y) => {
            return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
        });

        Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
        Composite.add(ropeB, Constraint.create({
            bodyB: ropeB.bodies[0],
            pointB: { x: -20, y: 0 },
            pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
            stiffness: 0.5
        }));

        group = Body.nextGroup(true);

        const ropeC = Composites.stack(600, 50, 13, 1, 10, 10, (x, y) => {
            return Bodies.rectangle(x - 20, y, 50, 20, { collisionFilter: { group: group }, chamfer: 5 });
        });

        Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
        Composite.add(ropeC, Constraint.create({
            bodyB: ropeC.bodies[0],
            pointB: { x: -20, y: 0 },
            pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
            stiffness: 0.5
        }));

        Composite.add(world, [
            ropeA,
            ropeB,
            ropeC,
            Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true })
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
            max: { x: 700, y: 600 }
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
            <div className='game-window' ref={canvasRef} />
        </div>
    );
};

export default Chains;