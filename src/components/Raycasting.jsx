import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Composite, Composites, Common, Bodies, Vertices, Query, Events, MouseConstraint, Mouse } from 'matter-js';
//import decomp from 'poly-decomp';

const Raycasting = () => {
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

        // Create stack
        const stack = Composites.stack(20, 20, 12, 4, 0, 0, (x, y) => {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
                    }
                case 1:
                    let sides = Math.round(Common.random(1, 8));
                    sides = (sides === 3) ? 4 : sides;
                    return Bodies.polygon(x, y, sides, Common.random(20, 50));
            }
        });

        const star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38');
        const concave = Bodies.fromVertices(200, 200, star);

        Composite.add(world, [
            stack,
            concave,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        let collisions = [];
        const startPoint = { x: 400, y: 100 };

        // Handle raycasting and rendering
        const handleAfterUpdate = () => {
            const mouse = mouseConstraint.mouse;
            const bodies = Composite.allBodies(engine.world);
            const endPoint = mouse.position || { x: 100, y: 600 };

            collisions = Query.ray(bodies, startPoint, endPoint);
        };

        const handleAfterRender = () => {
            const mouse = mouseConstraint.mouse;
            const context = render.context;
            const endPoint = mouse.position || { x: 100, y: 600 };

            Render.startViewTransform(render);

            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.strokeStyle = collisions.length > 0 ? '#fff' : '#555';
            context.lineWidth = 0.5;
            context.stroke();

            collisions.forEach(collision => {
                context.rect(collision.bodyA.position.x - 4.5, collision.bodyA.position.y - 4.5, 8, 8);
            });

            context.fillStyle = 'rgba(255,165,0,0.7)';
            context.fill();

            Render.endViewTransform(render);
        };

        Events.on(engine, 'afterUpdate', handleAfterUpdate);
        Events.on(render, 'afterRender', handleAfterRender);

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
            Events.off(engine, 'afterUpdate', handleAfterUpdate);
            Events.off(render, 'afterRender', handleAfterRender);
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return (
        <div className='game-window' ref={canvasRef} style={{ width: '800px', height: '600px' }} />
    );
};

export default Raycasting;