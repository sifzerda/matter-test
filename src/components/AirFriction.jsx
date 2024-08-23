import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const MatterComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the Matter.js components
    const { Engine, Render, Runner, MouseConstraint, Mouse, Composite, Bodies } = Matter;

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
        showVelocity: true
      }
    });

    // Attach the renderer's canvas to the DOM
    const canvas = render.canvas;
    canvasRef.current.appendChild(canvas);

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add bodies
    Composite.add(world, [
      // falling blocks
      Bodies.rectangle(200, 100, 60, 60, { frictionAir: 0.001 }),
      Bodies.rectangle(400, 100, 60, 60, { frictionAir: 0.05 }),
      Bodies.rectangle(600, 100, 60, 60, { frictionAir: 0.1 }),

      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // Add mouse control
    const mouse = Mouse.create(canvas);
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

    // Clean up function
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Matter.Mouse.remove(mouse);
      canvas.remove();
    };
  }, []);

  return <div className='game-window' ref={canvasRef} />;
};

export default MatterComponent;