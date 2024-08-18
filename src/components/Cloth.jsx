import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

// Define the cloth function as a standalone utility function
const createCloth = (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) => {
    const { Body, Bodies, Common, Composites } = Matter;

    const group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } }, constraintOptions);

    const cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, (x, y) => {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};

const Cloth = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const { Engine, Render, Runner, Body, Composites, MouseConstraint, Mouse, Composite, Bodies } = Matter;

        // Create engine
        const engine = Engine.create();
        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Create cloth
        const cloth = createCloth(200, 200, 20, 12, 5, 5, false, 8);

        for (let i = 0; i < 20; i++) {
            cloth.bodies[i].isStatic = true;
        }

        Composite.add(world, [
            cloth,
            Bodies.circle(300, 500, 80, { isStatic: true, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(500, 480, 80, 80, { isStatic: true, render: { fillStyle: '#060a19' } }),
            Bodies.rectangle(400, 609, 800, 50, { isStatic: true })
        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.98,
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
            Composite.remove(world, mouseConstraint);
        };
    }, []);

    return (
        <div>
            <div ref={canvasRef} />
        </div>
    );
};

export default Cloth;
