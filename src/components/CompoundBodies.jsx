import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Body, Constraint, Composite, MouseConstraint, Mouse, Bodies } from 'matter-js';

const CompoundBodies = () => {
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
                showAxes: true,
                showConvexHulls: true
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        let size = 200;
        let x = 200;
        let y = 200;

        const partA = Bodies.rectangle(x, y, size, size / 5);
        const partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render });

        const compoundBodyA = Body.create({
            parts: [partA, partB]
        });

        size = 150;
        x = 400;
        y = 300;

        const partC = Bodies.circle(x, y, 30);
        const partD = Bodies.circle(x + size, y, 30);
        const partE = Bodies.circle(x + size, y + size, 30);
        const partF = Bodies.circle(x, y + size, 30);

        const compoundBodyB = Body.create({
            parts: [partC, partD, partE, partF]
        });

        const constraint = Constraint.create({
            pointA: { x: 400, y: 100 },
            bodyB: compoundBodyB,
            pointB: { x: 0, y: 0 }
        });

        Composite.add(world, [
            compoundBodyA,
            compoundBodyB,
            constraint,
            Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true })
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

export default CompoundBodies;