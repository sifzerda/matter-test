import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Bodies, MouseConstraint, Mouse, Events } from 'matter-js';

const SensorsDemo = () => {
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
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const colorA = '#f55a3c';
        const colorB = '#f5d259';

        const collider = Bodies.rectangle(400, 300, 500, 50, {
            isSensor: true,
            isStatic: true,
            render: {
                strokeStyle: colorA,
                fillStyle: 'transparent',
                lineWidth: 1,
            },
        });

        Composite.add(world, [
            collider,
            Bodies.rectangle(400, 600, 800, 50, {
                isStatic: true,
                render: {
                    fillStyle: '#060a19',
                    lineWidth: 0,
                },
            }),
        ]);

        Composite.add(world, Bodies.circle(400, 40, 30, {
            render: {
                strokeStyle: colorB,
                fillStyle: 'transparent',
                lineWidth: 1,
            },
        }));

        // Handle collisionStart event
        Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            
            for (const pair of pairs) {
                if (pair.bodyA === collider) {
                    pair.bodyB.render.strokeStyle = colorA;
                } else if (pair.bodyB === collider) {
                    pair.bodyA.render.strokeStyle = colorA;
                }
            }
        });

        // Handle collisionEnd event
        Events.on(engine, 'collisionEnd', (event) => {
            const pairs = event.pairs;
            
            for (const pair of pairs) {
                if (pair.bodyA === collider) {
                    pair.bodyB.render.strokeStyle = colorB;
                } else if (pair.bodyB === collider) {
                    pair.bodyA.render.strokeStyle = colorB;
                }
            }
        });

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
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef}/>
    );
};

export default SensorsDemo;