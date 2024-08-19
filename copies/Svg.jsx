import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const MatterComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Destructure Matter.js modules
    const { Engine, Render, World, Bodies, Common, Svg } = Matter;

    // Create an engine
    const engine = Engine.create();

    // Create a renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // Create ground
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // Create vertexSets array and color
    const vertexSets = [];
    const color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

    // Add SVG paths
    document.querySelectorAll('../public/SVGlogo.svg').forEach((path, i) => {
      const vertices = Svg.pathToVertices(path, 20);
      const body = Bodies.fromVertices(100 + i * 80, 80, vertices, {
        render: {
          fillStyle: color,
          strokeStyle: color
        }
      }, true);
      vertexSets.push(body);
    });

    vertexSets.push(ground);

    // Add all of the bodies to the world
    World.add(engine.world, vertexSets);

    // Run the engine and renderer
    Engine.run(engine);
    Render.run(render);

    // Cleanup function
    return () => {
      Render.stop(render);
      Engine.clear(engine);
      World.clear(engine.world);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default MatterComponent;