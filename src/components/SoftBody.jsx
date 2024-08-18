import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Common, Composite, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

// Utility function to create a soft body
const createSoftBody = (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) => {
    particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);

    const softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, (x, y) => {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

    softBody.label = 'Soft Body';

    return softBody;
};

const SoftBodyDemo = () => {
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
                showAngleIndicator: false,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const particleOptions = {
            friction: 0.05,
            frictionStatic: 0.1,
            render: { visible: true },
        };

        Composite.add(world, [
            createSoftBody(250, 100, 5, 5, 0, 0, true, 18, particleOptions),
            createSoftBody(400, 300, 8, 3, 0, 0, true, 15, particleOptions),
            createSoftBody(250, 400, 4, 4, 0, 0, true, 15, particleOptions),
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
                stiffness: 0.9,
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
        <div
            ref={canvasRef}
            style={{ width: '800px', height: '600px', border: '1px solid #000' }}
        />
    );
};

export default SoftBodyDemo;