import { useEffect, useRef } from 'react';
import { Engine, Render, Query, Svg, Runner, Composite, Composites, Bodies, MouseConstraint, Mouse } from 'matter-js';

import 'poly-decomp'; // Ensure you have this library available

const TerrainDemo = () => {
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
                height: 600,
                wireframes: true, // Render unfilled shapes
                background: '#ffffff' // Background color
            }
        });

        Render.run(render);

        // Create the runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Function to select SVG paths
        const select = (root, selector) => Array.from(root.querySelectorAll(selector));

        // Function to load SVGs
        const loadSvg = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                const raw = await response.text();
                return new window.DOMParser().parseFromString(raw, 'image/svg+xml');
            } catch (error) {
                console.error(`Error loading SVG from ${url}:`, error);
                return null;
            }
        };

        // Handle SVG data
        const handleSvgData = (root) => {
            if (!root) return;

            const paths = select(root, 'path');
            if (paths.length === 0) {
                console.warn('No paths found in SVG');
                return;
            }

            const vertexSets = paths.map((path) => {
                try {
                    return Svg.pathToVertices(path, 30);
                } catch (error) {
                    console.error('Error converting SVG path to vertices:', error);
                    return [];
                }
            });

            const terrain = Bodies.fromVertices(400, 350, vertexSets, {
                isStatic: true,
                render: {
                    fillStyle: '#060a19',
                    strokeStyle: '#060a19',
                    lineWidth: 1
                }
            }, true);

            Composite.add(world, terrain);

            const bodyOptions = {
                frictionAir: 0,
                friction: 0.0001,
                restitution: 0.6
            };

            Composite.add(world, Composites.stack(80, 100, 20, 20, 10, 10, (x, y) => {
                if (Query.point([terrain], { x: x, y: y }).length === 0) {
                    return Bodies.polygon(x, y, 5, 12, bodyOptions);
                }
            }));
        };

        // Load and add SVG bodies
        loadSvg('./../../public/terrain.svg').then(handleSvgData);

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

export default TerrainDemo;