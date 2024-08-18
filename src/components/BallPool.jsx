import { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Bodies, Mouse, MouseConstraint } from 'matter-js';
import MatterWrap from 'matter-wrap';

// Ensure matter-wrap is available in the environment
// This will load the plugin dynamically if it is not already present
const loadMatterWrap = async () => {
  if (typeof MatterWrap === 'undefined') {
    // If using a module bundler that supports dynamic imports
    const module = await import('matter-wrap');
    Matter.use(module.default);
  } else {
    // If matter-wrap is available globally (e.g., included in a script tag)
    Matter.use(MatterWrap);
  }
};

const BallPool = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const initializeMatter = async () => {
      await loadMatterWrap();

      // Create engine and world
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

      Render.run(render);

      // Create runner
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      // Add static ground
      Matter.Composite.add(world, [
        Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true, render: { fillStyle: '#060a19' } })
      ]);

      // Create stack of circles and add other bodies
      const stack = Matter.Composites.stack(100, 0, 10, 8, 10, 10, (x, y) => {
        return Bodies.circle(x, y, Matter.Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
      });
      
      Matter.Composite.add(world, [
        stack,
        Bodies.polygon(200, 460, 3, 60),
        Bodies.polygon(400, 460, 5, 60),
        Bodies.rectangle(600, 460, 80, 80)
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

      Matter.Composite.add(world, mouseConstraint);

      // Sync the mouse with rendering
      render.mouse = mouse;

      // Fit the render viewport to the scene
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      });

      // Apply wrapping using matter-wrap plugin
      const allBodies = Matter.Composite.allBodies(world);
      allBodies.forEach(body => {
        body.plugin.wrap = {
          min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
          max: { x: render.bounds.max.x + 100, y: render.bounds.max.y }
        };
      });

      // Cleanup function to stop the simulation when the component unmounts
      return () => {
        Render.stop(render);
        Matter.Runner.stop(runner);
      };
    };

    initializeMatter();

  }, []); // Empty dependency array to ensure this runs only once

  return <div ref={canvasRef} style={{ width: '800px', height: '600px' }} />;
};

export default BallPool;