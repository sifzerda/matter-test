import { useEffect, useRef } from 'react';
import { Engine, Render, Common,  World, Runner, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

const StatsAndPerformanceDemo = () => {
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
                showStats: true, // Show stats and performance monitors
                showPerformance: true,
                wireframes: true // Show unfilled shapes
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Scene code
        const stack = Composites.stack(70, 30, 13, 9, 5, 5, (x, y) => {
            return Bodies.circle(x, y, 10 + Common.random() * 20);
        });

        World.add(world, [
            stack,
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
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        World.add(world, mouseConstraint);

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

export default StatsAndPerformanceDemo;