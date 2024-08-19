import { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Common, Vertices, Svg, Composite, Bodies, MouseConstraint, Mouse } from 'matter-js';
import decomp from 'poly-decomp';

window.decomp = decomp; // poly-decomp is available globally

const SvgDemo = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Initialize the Matter.js engine
        const engine = Engine.create();
        const world = engine.world;

        // Create the renderer
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600
            }
        });

        Render.run(render);

        // Create the runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Function to select SVG paths
        const select = (root, selector) => Array.from(root.querySelectorAll(selector));

        // Function to load SVGs
        const loadSvg = (url) => 
            fetch(url)
                .then(response => response.text())
                .then(raw => (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'));

        // List of SVG paths to load
        const svgPaths = [
         '../../public/iconmonstr-check-mark-8-icon.svg',
            '../../public/iconmonstr-user-icon.svg',
            '../../public/iconmonstr-paperclip-2-icon.svg',
            '../../public/iconmonstr-direction-4-icon.svg',
            '../../public/iconmonstr-puzzle-icon.svg',
            '../../public/svg.svg',
        ];

        svgPaths.forEach((path, i) => {
            loadSvg(path).then(root => {
                try {
                    const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
                    const vertexSets = select(root, 'path')
                        .map(pathElement => {
                            const vertices = Svg.pathToVertices(pathElement, 30);
                            return Vertices.scale(vertices, 0.4, 0.4);
                        });

                    Composite.add(world, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
                        render: {
                            fillStyle: color,
                            strokeStyle: color,
                            lineWidth: 1
                        }
                    }, true));
                } catch (error) {
                    console.error("Error processing SVG:", error);
                }
            }).catch(error => console.error("Error loading SVG:", error));
        });

        // Add static bodies (walls)
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

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
        <div
            ref={canvasRef}
            style={{ width: '800px', height: '600px', border: '1px solid #000' }}
        />
    );
};

export default SvgDemo;