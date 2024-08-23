import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Events, Composites, Common, Composite, Bodies, MouseConstraint, Mouse } from 'matter-js';

const StressTest4Demo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {

        // Create engine with custom position and velocity iterations
        const engine = Engine.create({
            positionIterations: 25,
            velocityIterations: 35
        });

        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showStats: true,
                showPerformance: true,
                wireframes: true // Show unfilled shapes
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Stack generator function
        const stack = (scale, columns, rows) => {
            return Composites.stack(40, 40, columns, rows, 0, 0, (x, y) => {
                const sides = Math.round(Common.random(1, 8));
                const shapeType = Math.round(Common.random(0, 1));

                if (shapeType === 0) {
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(25, 50) * scale, Common.random(25, 50) * scale);
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120) * scale, Common.random(25, 30) * scale);
                    }
                } else {
                    return Bodies.polygon(x, y, sides, Common.random(25, 50) * scale);
                }
            });
        };

        // Add bodies to the world
        Composite.add(world, [
            stack(0.2, 61, 15), 
            stack(0.3, 31, 12),
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: { visible: false } })
        ]);

        // Set scene animation
        engine.timing.timeScale = 0.9;
        engine.gravity.scale = 0.0007;

        Events.on(engine, 'beforeUpdate', () => {
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

export default StressTest4Demo;