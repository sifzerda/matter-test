import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Common, Composite, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

const SpritesDemo = () => {
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
                showAngleIndicator: false,
                wireframes: false,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const offset = 10;
        const options = { 
            isStatic: true
        };

        world.bodies = [];

        // Static walls (not rendered in this example)
        Composite.add(world, [
            Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
            Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
            Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
            Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
        ]);

        const stack = Composites.stack(20, 20, 10, 4, 0, 0, (x, y) => {
            if (Common.random() > 0.35) {
                return Bodies.rectangle(x, y, 64, 64, {
                    render: {
                        strokeStyle: '#ffffff',
                        sprite: {
                            texture: './../../public/box.png'
                        }
                    }
                });
            } else {
                return Bodies.circle(x, y, 46, {
                    density: 0.0005,
                    frictionAir: 0.06,
                    restitution: 0.3,
                    friction: 0.01,
                    render: {
                        sprite: {
                            texture: './../../public/ball.png'
                        }
                    }
                });
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

export default SpritesDemo;