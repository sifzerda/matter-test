import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const CompositeRemove = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Destructure Matter.js modules
        const {
            Engine,
            Render,
            Runner,
            Composite,
            Composites,
            Common,
            MouseConstraint,
            Mouse,
            Bodies,
            Events,
        } = Matter;

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
                showSleeping: true,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Function to create a stack of bodies
        const createStack = () => {
            return Composites.stack(20, 20, 10, 5, 0, 0, (x, y) => {
                const sides = Math.round(Common.random(1, 8));

                // Round the edges of some bodies
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
                }
            });
        };

        let stack = null;
        const bottomStack = createStack();
        let lastTimestamp = 0;

        // Update logic to add/remove bodies
        const handleAfterUpdate = (event) => {
            if (event.timestamp - lastTimestamp < 800) {
                return;
            }

            lastTimestamp = event.timestamp;

            // Remove an old body
            Composite.remove(bottomStack, bottomStack.bodies[0]);

            // Add a new body
            Composite.add(bottomStack, Bodies.rectangle(Common.random(100, 500), 50, Common.random(25, 50), Common.random(25, 50)));

            // Remove last stack
            if (stack) {
                Composite.remove(world, stack);
            }

            // Create a new stack
            stack = createStack();

            // Add the new stack
            Composite.add(world, stack);
        };

        Events.on(engine, 'afterUpdate', handleAfterUpdate);

        // Add initial composites and walls
        Composite.add(world, [
            bottomStack,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        ]);

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

        // Cleanup function
        return () => {
            Events.off(engine, 'afterUpdate', handleAfterUpdate);
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef} style={{ width: '800px', height: '600px' }} />
    );
};

export default CompositeRemove;