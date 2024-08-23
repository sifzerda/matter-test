import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Composites, Common, Bodies, MouseConstraint, Mouse } from 'matter-js';

const SleepingDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Create engine
        const engine = Engine.create({
            enableSleeping: true,
        });
        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add walls
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        ]);

        // Create and add stack of bodies
        const stack = Composites.stack(50, 50, 12, 3, 0, 0, (x, y) => {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    return Common.random() < 0.8
                        ? Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50))
                        : Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
                case 1:
                    return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 50));
                default:
                    return null;
            }
        });

        Composite.add(world, stack);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
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

        // Event listeners for sleepStart and sleepEnd (if needed)
        /*
        for (const body of stack.bodies) {
            Events.on(body, 'sleepStart sleepEnd', (event) => {
                console.log('body id', body.id, 'sleeping:', body.isSleeping);
            });
        }
        */

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

export default SleepingDemo;