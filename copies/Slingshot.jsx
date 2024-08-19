import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Composites, Events, Bodies, Body, MouseConstraint, Constraint, Mouse } from 'matter-js';

const SlingshotDemo = () => {
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
                showAngleIndicator: true,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        let rock = Bodies.polygon(170, 450, 8, 20, { density: 0.004 });
        const anchor = { x: 170, y: 450 };
        const elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            length: 0.01,
            damping: 0.01,
            stiffness: 0.05,
        });

        const pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, 25, 40);
        });

        const ground = Bodies.rectangle(395, 600, 815, 50, { 
            isStatic: true,
            render: { fillStyle: '#060a19' }
        });

        const ground2 = Bodies.rectangle(610, 250, 200, 20, { 
            isStatic: true,
            render: { fillStyle: '#060a19' }
        });

        const pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, 25, 40);
        });

        Composite.add(world, [ground, pyramid, ground2, pyramid2, rock, elastic]);

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

        // Handle updates
        Events.on(engine, 'afterUpdate', () => {
            if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
                // Limit maximum speed of current rock
                if (Body.getSpeed(rock) > 45) {
                    Body.setSpeed(rock, 45);
                }

                // Release current rock and add a new one
                rock = Bodies.polygon(170, 450, 7, 20, { density: 0.004 });
                Composite.add(engine.world, rock);
                elastic.bodyB = rock;
            }
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

export default SlingshotDemo;