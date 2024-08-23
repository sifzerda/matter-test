import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const ViewsDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const {
            Engine,
            Render,
            Runner,
            Events,
            Composites,
            Common,
            MouseConstraint,
            Mouse,
            Composite,
            Vector,
            Bounds,
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
                hasBounds: true,
                showAngleIndicator: true,
                wireframes: true,
                background: '#ffffff'
            }
        });

        Render.run(render);

        // Create the runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bodies
        const stack = Composites.stack(20, 20, 10, 4, 0, 0, (x, y) => {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
                    } else {
                        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
                    }
                case 1:
                    const sides = Math.round(Common.random(1, 8));
                    const adjustedSides = sides === 3 ? 4 : sides;
                    return Bodies.polygon(x, y, adjustedSides, Common.random(20, 50));
            }
        });

        Composite.add(world, [
            stack,
            // Walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // Viewport setup
        const viewportCentre = {
            x: render.options.width * 0.5,
            y: render.options.height * 0.5
        };

        const extents = {
            min: { x: -300, y: -300 },
            max: { x: 1100, y: 900 }
        };

        let boundsScaleTarget = 1;
        const boundsScale = { x: 1, y: 1 };

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

        // Control viewport scaling and translation
        Events.on(render, 'beforeRender', () => {
            const mouse = mouseConstraint.mouse;
            let translate;

            // Mouse wheel controls zoom
            const scaleFactor = mouse.wheelDelta * -0.1;
            if (scaleFactor !== 0) {
                if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
                    boundsScaleTarget += scaleFactor;
                }
            }

            // Smoothly tween scale factor
            if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
                const scaleChange = (boundsScaleTarget - boundsScale.x) * 0.2;
                boundsScale.x += scaleChange;
                boundsScale.y += scaleChange;

                render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
                render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

                translate = {
                    x: render.options.width * scaleChange * -0.5,
                    y: render.options.height * scaleChange * -0.5
                };

                Bounds.translate(render.bounds, translate);

                Mouse.setScale(mouse, boundsScale);
                Mouse.setOffset(mouse, render.bounds.min);
            }

            // View translation
            const deltaCentre = Vector.sub(mouse.absolute, viewportCentre);
            const centreDist = Vector.magnitude(deltaCentre);

            if (centreDist > 50) {
                const direction = Vector.normalise(deltaCentre);
                const speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);
                translate = Vector.mult(direction, speed);

                if (render.bounds.min.x + translate.x < extents.min.x)
                    translate.x = extents.min.x - render.bounds.min.x;
                if (render.bounds.max.x + translate.x > extents.max.x)
                    translate.x = extents.max.x - render.bounds.max.x;
                if (render.bounds.min.y + translate.y < extents.min.y)
                    translate.y = extents.min.y - render.bounds.min.y;
                if (render.bounds.max.y + translate.y > extents.max.y)
                    translate.y = extents.max.y - render.bounds.max.y;

                Bounds.translate(render.bounds, translate);

                Mouse.setOffset(mouse, render.bounds.min);
            }
        });

        // Cleanup function
        return () => {
            Render.stop(render);
            Runner.stop(runner);
        };
    }, []);

    return (
        <div className='game-window'ref={canvasRef}/>
    );
};

export default ViewsDemo;