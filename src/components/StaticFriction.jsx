import { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Events, Body, Runner, Composite, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

const StaticFrictionDemo = () => {
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
                showVelocity: true,
                wireframes: true // Show unfilled shapes
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const body = Bodies.rectangle(400, 500, 200, 60, { isStatic: true, chamfer: 10, render: { fillStyle: '#060a19' } });
        const size = 50;

        const stack = Composites.stack(350, 470 - 6 * size, 1, 6, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, size * 2, size, {
                slop: 0.5,
                friction: 1,
                frictionStatic: Infinity
            });
        });

        Composite.add(world, [
            body,
            stack,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        Events.on(engine, 'beforeUpdate', () => {
            if (engine.timing.timestamp < 1500) {
                return;
            }

            const px = 400 + 100 * Math.sin((engine.timing.timestamp - 1500) * 0.001);

            // Manual update velocity required for older releases
            if (Matter.version === '0.18.0') {
                Body.setVelocity(body, { x: px - body.position.x, y: 0 });
            }

            Body.setPosition(body, { x: px, y: body.position.y }, true);
        });

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
        <div
            ref={canvasRef}
            style={{ width: '800px', height: '600px', border: '1px solid #000' }}
        />
    );
};

export default StaticFrictionDemo;