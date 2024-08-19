import { useEffect, useRef } from 'react';
import { Engine, Common, Render, Runner, Composites, Composite, Bodies, MouseConstraint, Mouse } from 'matter-js';

const StressTest3Demo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {

        // Create engine with custom position and velocity iterations
        const engine = Engine.create({
            positionIterations: 10,
            velocityIterations: 10
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

        // Add bodies
        const scale = 0.3;

        const stack = Composites.stack(40, 40, 38, 18, 0, 0, (x, y) => {
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

        Composite.add(world, stack);

        Composite.add(world, [
            // Walls
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

export default StressTest3Demo;