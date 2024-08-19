import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

const CollisionFiltering = () => {
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
                wireframes: false
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Define categories (bit fields)
        const defaultCategory = 0x0001;
        const redCategory = 0x0002;
        const greenCategory = 0x0004;
        const blueCategory = 0x0008;

        const colorA = '#f55a3c';
        const colorB = '#063e7b';
        const colorC = '#f5d259';

        // Add floor
        Composite.add(world, Bodies.rectangle(400, 600, 900, 50, { 
            isStatic: true,
            render: {
                fillStyle: 'transparent',
                lineWidth: 1
            } 
        }));

        // Create stack with varying body categories
        Composite.add(world,
            Composites.stack(275, 100, 5, 9, 10, 10, (x, y, column, row) => {
                let category = redCategory;
                let color = colorA;

                if (row > 5) {
                    category = blueCategory;
                    color = colorB;
                } else if (row > 2) {
                    category = greenCategory;
                    color = colorC;
                }

                return Bodies.circle(x, y, 20, {
                    collisionFilter: {
                        category: category
                    },
                    render: {
                        strokeStyle: color,
                        fillStyle: 'transparent',
                        lineWidth: 1
                    }
                });
            })
        );

        // Create bodies with specific collision masks
        Composite.add(world,
            Bodies.circle(310, 40, 30, {
                collisionFilter: {
                    mask: defaultCategory | greenCategory
                },
                render: {
                    fillStyle: colorC
                }
            })
        );

        Composite.add(world,
            Bodies.circle(400, 40, 30, {
                collisionFilter: {
                    mask: defaultCategory | redCategory
                },
                render: {
                    fillStyle: colorA
                }
            })
        );

        Composite.add(world,
            Bodies.circle(480, 40, 30, {
                collisionFilter: {
                    mask: defaultCategory | blueCategory
                },
                render: {
                    fillStyle: colorB
                }
            })
        );

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

        // Red category objects should not be draggable with the mouse
        mouseConstraint.collisionFilter.mask = defaultCategory | blueCategory | greenCategory;

        // Fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        // Cleanup function
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Composite.remove(world, mouseConstraint);
        };
    }, []);

    return (
        <div>
            <div ref={canvasRef} />
        </div>
    );
};

export default CollisionFiltering;