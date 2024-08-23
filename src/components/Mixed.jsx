import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';

const MixedShapes = () => {
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
                showAngleIndicator: true
            }
        });

        // Run the renderer
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const stack = Composites.stack(20, 20, 10, 5, 0, 0, (x, y) => {
            const sides = Math.round(Common.random(1, 8));
            let chamfer = null;

            if (sides > 2 && Common.random() > 0.7) {
                chamfer = { radius: 10 };
            }

            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer });
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer });
                    }
                case 1:
                    return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer });
                default:
                    return null;
            }
        });

        Composite.add(world, stack);

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
                stiffness: 0.2,
                render: { visible: false }
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
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef} />
    );
};

export default MixedShapes;