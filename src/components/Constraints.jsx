import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Common, Constraint, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';
import polyDecomp from 'poly-decomp';

const ConstraintsDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {

        // Provide concave decomposition support
        Common.setDecomp(polyDecomp);

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

        // Add stiff global constraint
        let body = Bodies.polygon(150, 200, 5, 30);
        let constraint = Constraint.create({
            pointA: { x: 150, y: 100 },
            bodyB: body,
            pointB: { x: -10, y: -10 }
        });
        Composite.add(world, [body, constraint]);

        // Add soft global constraint
        body = Bodies.polygon(280, 100, 3, 30);
        constraint = Constraint.create({
            pointA: { x: 280, y: 120 },
            bodyB: body,
            pointB: { x: -10, y: -7 },
            stiffness: 0.001
        });
        Composite.add(world, [body, constraint]);

        // Add damped soft global constraint
        body = Bodies.polygon(400, 100, 4, 30);
        constraint = Constraint.create({
            pointA: { x: 400, y: 120 },
            bodyB: body,
            pointB: { x: -10, y: -10 },
            stiffness: 0.001,
            damping: 0.05
        });
        Composite.add(world, [body, constraint]);

        // Add revolute constraint
        body = Bodies.rectangle(600, 200, 200, 20);
        const ball = Bodies.circle(550, 150, 20);
        constraint = Constraint.create({
            pointA: { x: 600, y: 200 },
            bodyB: body,
            length: 0
        });
        Composite.add(world, [body, ball, constraint]);

        // Add revolute multi-body constraint
        const bodyA = Bodies.rectangle(500, 400, 100, 20, { collisionFilter: { group: -1 } });
        const ballA = Bodies.circle(600, 400, 20, { collisionFilter: { group: -1 } });
        constraint = Constraint.create({
            bodyA: bodyA,
            bodyB: ballA
        });
        Composite.add(world, [bodyA, ballA, constraint]);

        // Add stiff multi-body constraint
        const bodyB = Bodies.polygon(100, 400, 6, 20);
        const bodyC = Bodies.polygon(200, 400, 1, 50);
        constraint = Constraint.create({
            bodyA: bodyB,
            pointA: { x: -10, y: -10 },
            bodyB: bodyC,
            pointB: { x: -10, y: -10 }
        });
        Composite.add(world, [bodyB, bodyC, constraint]);

        // Add soft global constraint
        const bodyD = Bodies.polygon(300, 400, 4, 20);
        const bodyE = Bodies.polygon(400, 400, 3, 30);
        constraint = Constraint.create({
            bodyA: bodyD,
            pointA: { x: -10, y: -10 },
            bodyB: bodyE,
            pointB: { x: -10, y: -7 },
            stiffness: 0.001
        });
        Composite.add(world, [bodyD, bodyE, constraint]);

        // Add damped soft global constraint
        const bodyF = Bodies.polygon(500, 400, 6, 30);
        const bodyG = Bodies.polygon(600, 400, 7, 60);
        constraint = Constraint.create({
            bodyA: bodyF,
            pointA: { x: -10, y: -10 },
            bodyB: bodyG,
            pointB: { x: -10, y: -10 },
            stiffness: 0.001,
            damping: 0.1
        });
        Composite.add(world, [bodyF, bodyG, constraint]);

        // Add walls
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // Allow bodies on mouse to rotate
                angularStiffness: 0,
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

export default ConstraintsDemo;