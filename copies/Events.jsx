import { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Body, Events, Composite, Composites, Common, MouseConstraint, Mouse, Bodies } from 'matter-js';

// Import poly-decomp if necessary
import polyDecomp from 'poly-decomp';

const EventsExample = () => {
    const canvasRef = useRef(null);

    useEffect(() => {

        // Provide concave decomposition support
        Matter.Common.setDecomp(polyDecomp);

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
                wireframes: false
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Event listeners
        Events.on(world, 'afterAdd', (event) => {
            // Example: Do something with event.object
        });

        let lastTime = Common.now();

        Events.on(engine, 'beforeUpdate', (event) => {
            if (Common.now() - lastTime >= 5000) {
                shakeScene(engine);
                lastTime = Common.now();
            }
        });

        Events.on(engine, 'collisionStart', (event) => {
            event.pairs.forEach(pair => {
                pair.bodyA.render.fillStyle = '#333';
                pair.bodyB.render.fillStyle = '#333';
            });
        });

        Events.on(engine, 'collisionActive', (event) => {
            event.pairs.forEach(pair => {
                pair.bodyA.render.fillStyle = '#333';
                pair.bodyB.render.fillStyle = '#333';
            });
        });

        Events.on(engine, 'collisionEnd', (event) => {
            event.pairs.forEach(pair => {
                pair.bodyA.render.fillStyle = '#222';
                pair.bodyB.render.fillStyle = '#222';
            });
        });

        const bodyStyle = { fillStyle: '#222' };

        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: bodyStyle }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: bodyStyle }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: bodyStyle }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: bodyStyle })
        ]);

        const stack = Composites.stack(70, 100, 9, 4, 50, 50, (x, y) => {
            return Bodies.circle(x, y, 15, { restitution: 1, render: bodyStyle });
        });

        Composite.add(world, stack);

        const shakeScene = (engine) => {
            const timeScale = (1000 / 60) / engine.timing.lastDelta;
            const bodies = Composite.allBodies(engine.world);

            bodies.forEach(body => {
                if (!body.isStatic && body.position.y >= 500) {
                    const forceMagnitude = (0.03 * body.mass) * timeScale;
                    Body.applyForce(body, body.position, { 
                        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
                        y: -forceMagnitude + Common.random() * -forceMagnitude
                    });
                }
            });
        };

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

        Events.on(mouseConstraint, 'mousedown', (event) => {
            const mousePosition = event.mouse.position;
            console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
            shakeScene(engine);
        });

        Events.on(mouseConstraint, 'mouseup', (event) => {
            const mousePosition = event.mouse.position;
            console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y);
        });

        Events.on(mouseConstraint, 'startdrag', (event) => {
            console.log('startdrag', event);
        });

        Events.on(mouseConstraint, 'enddrag', (event) => {
            console.log('enddrag', event);
        });

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
        <div ref={canvasRef} />
    );
};

export default EventsExample;