import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Events, Composite, Bodies, MouseConstraint, Mouse } from 'matter-js';

const SubstepDemo = () => {
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
                wireframes: false,
                showDebug: true,
                background: '#000',
                pixelRatio: 2
            }
        });

        Render.run(render);

        // Create runner with higher precision timestep
        const runner = Runner.create({
            delta: 1000 / (60 * 10),  // 600Hz delta = 1.666ms = 10upf @ 60fps
            maxFrameTime: 1000 / 50  // 50fps minimum performance target
        });

        Runner.run(runner, engine);

        // Add demo bodies with very thin dimensions
        Composite.add(world, [
            Bodies.rectangle(250, 250, 300, 1.25, {
                frictionAir: 0,
                friction: 0,
                restitution: 0.9,
                angle: 0.5,
                render: {
                    lineWidth: 0.5,
                    fillStyle: '#f55a3c'
                }
            }),
            Bodies.circle(200, 200, 2.25, {
                frictionAir: 0,
                friction: 0,
                restitution: 0.9,
                angle: 0.5,
                render: {
                    fillStyle: '#fff'
                }
            })
        ]);

        // Add static bodies (walls)
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: { visible: false } })
        ]);

        // Scene animation
        Events.on(engine, 'afterUpdate', () => {
            engine.gravity.scale = 0.00035;
            engine.gravity.x = Math.cos(engine.timing.timestamp * 0.0005);
            engine.gravity.y = Math.sin(engine.timing.timestamp * 0.0005);
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
        <div className='game-window' ref={canvasRef}/>
    );
};

export default SubstepDemo;