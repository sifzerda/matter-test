import { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Body, Events, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

const ManipulationExample = () => {
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
                showCollisions: true,
                showConvexHulls: true
            }
        });

        // Run the renderer
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const bodyA = Bodies.rectangle(100, 300, 50, 50, { isStatic: true, render: { fillStyle: '#060a19' } });
        const bodyB = Bodies.rectangle(200, 200, 50, 50);
        const bodyC = Bodies.rectangle(300, 200, 50, 50);
        const bodyD = Bodies.rectangle(400, 200, 50, 50);
        const bodyE = Bodies.rectangle(550, 200, 50, 50);
        const bodyF = Bodies.rectangle(700, 200, 50, 50);
        const bodyG = Bodies.circle(400, 100, 25, { render: { fillStyle: '#060a19' } });

        // Add compound body
        const partA = Bodies.rectangle(600, 200, 120 * 0.8, 50 * 0.8, { render: { fillStyle: '#060a19' } });
        const partB = Bodies.rectangle(660, 200, 50 * 0.8, 190 * 0.8, { render: { fillStyle: '#060a19' } });
        const compound = Body.create({
            parts: [partA, partB],
            isStatic: true
        });

        Body.setPosition(compound, { x: 600, y: 300 });

        Composite.add(world, [bodyA, bodyB, bodyC, bodyD, bodyE, bodyF, bodyG, compound]);

        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        let lastTime = 0;
        let scaleRate = 0.6;

        // Handle updates
        const update = (event) => {
            const timeScale = (event.delta || (1000 / 60)) / 1000;

            if (scaleRate > 0) {
                Body.scale(bodyF, 1 + (scaleRate * timeScale), 1 + (scaleRate * timeScale));

                // Modify bodyE vertices
                bodyE.vertices[0].x -= 0.2 * timeScale;
                bodyE.vertices[0].y -= 0.2 * timeScale;
                bodyE.vertices[1].x += 0.2 * timeScale;
                bodyE.vertices[1].y -= 0.2 * timeScale;
                Body.setVertices(bodyE, bodyE.vertices);
            }

            // Make bodyA move up and down
            const py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002);

            // Manual update velocity required for older releases
            if (Matter.version === '0.18.0') {
                Body.setVelocity(bodyA, { x: 0, y: py - bodyA.position.y });
                Body.setVelocity(compound, { x: 0, y: py - compound.position.y });
                Body.setAngularVelocity(compound, 1 * Math.PI * timeScale);
            }

            // Move body and update velocity
            Body.setPosition(bodyA, { x: 100, y: py }, true);

            // Move compound body up and down and update velocity
            Body.setPosition(compound, { x: 600, y: py }, true);

            // Rotate compound body and update angular velocity
            Body.rotate(compound, 1 * Math.PI * timeScale, null, true);

            // After first 0.8 sec (simulation time)
            if (engine.timing.timestamp >= 800) {
                Body.setStatic(bodyG, true);
            }

            // Every 1.5 sec (simulation time)
            if (engine.timing.timestamp - lastTime >= 1500) {
                Body.setVelocity(bodyB, { x: 0, y: -10 });
                Body.setAngle(bodyC, -Math.PI * 0.26);
                Body.setAngularVelocity(bodyD, 0.2);

                // Stop scaling
                scaleRate = 0;

                // Update last time
                lastTime = engine.timing.timestamp;
            }
        };

        Events.on(engine, 'beforeUpdate', update);

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
            Events.off(engine, 'beforeUpdate', update);
        };
    }, []);

    return (
        <div ref={canvasRef} />
    );
};

export default ManipulationExample;