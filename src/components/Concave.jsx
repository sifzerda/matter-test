import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Vertices, Bodies } from 'matter-js';
import polyDecomp from 'poly-decomp';

const ConcaveShapes = () => {
    const canvasRef = useRef(null);

    useEffect(() => {

        // Provide concave decomposition support
        Common.setDecomp(polyDecomp);

        // Create engine
        const engine = Engine.create();
        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600
            }
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        Composite.add(world, [
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        const arrow = Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50');
        const chevron = Vertices.fromPath('100 0 75 50 100 100 25 100 0 50 25 0');
        const star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38');
        const horseShoe = Vertices.fromPath('35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7');

        const stack = Composites.stack(50, 50, 6, 4, 10, 10, (x, y) => {
            const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
            return Bodies.fromVertices(x, y, Common.choose([arrow, chevron, star, horseShoe]), {
                render: {
                    fillStyle: color,
                    strokeStyle: color,
                    lineWidth: 1
                }
            }, true);
        });

        Composite.add(world, stack);

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
        <div>
            <div ref={canvasRef} />
        </div>
    );
};

export default ConcaveShapes;