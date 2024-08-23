import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import 'poly-decomp'; // Ensure this library is available for concave decomposition

const TimeScaleDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const {
            Engine,
            Render,
            Runner,
            Body,
            Events,
            Composite,
            Composites,
            Common,
            MouseConstraint,
            Mouse,
            Bodies
        } = Matter;

        // Initialize the Matter.js engine
        const engine = Engine.create();
        const world = engine.world;

        // Create the renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
                wireframes: true,
                background: '#ffffff'
            }
        });

        Render.run(render);

        // Create the runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add static boundaries
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // Explosion effect
        const explosion = (engine, delta) => {
            const timeScale = (1000 / 60) / delta;
            const bodies = Composite.allBodies(engine.world);

            for (const body of bodies) {
                if (!body.isStatic && body.position.y >= 500) {
                    const forceMagnitude = (0.05 * body.mass) * timeScale;

                    Body.applyForce(body, body.position, {
                        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
                        y: -forceMagnitude + Common.random() * -forceMagnitude
                    });
                }
            }
        };

        let timeScaleTarget = 1;
        let lastTime = Common.now();

        Events.on(engine, 'afterUpdate', (event) => {
            const timeScale = (event.delta || (1000 / 60)) / 1000;
            engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

            if (Common.now() - lastTime >= 2000) {
                timeScaleTarget = timeScaleTarget < 1 ? 1 : 0;
                explosion(engine, event.delta);
                lastTime = Common.now();
            }
        });

        const bodyOptions = {
            frictionAir: 0,
            friction: 0.0001,
            restitution: 0.8
        };

        // Add dynamic bodies
        Composite.add(world, Composites.stack(20, 100, 15, 3, 20, 40, (x, y) => {
            return Bodies.circle(x, y, Common.random(10, 20), bodyOptions);
        }));

        Composite.add(world, Composites.stack(50, 50, 8, 3, 0, 0, (x, y) => {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50), bodyOptions);
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), bodyOptions);
                    }
                case 1:
                    return Bodies.polygon(x, y, Math.round(Common.random(4, 8)), Common.random(20, 50), bodyOptions);
            }
        }));

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
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef}/>
    );
};

export default TimeScaleDemo;