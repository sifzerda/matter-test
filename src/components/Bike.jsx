import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Mouse, MouseConstraint, Bodies } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Bikex = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  window.decomp = decomp; // poly-decomp is available globally

  useEffect(() => {
    console.log('Component mounted or updated');
    Matter.use(MatterWrap);
    engine.world.gravity.y = 0.1; // Set gravity to a small value to simulate gradual dropping

    const width = 1500;
    const height = 680;

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false
      }
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Setup mouse constraint for dragging
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
    mouseConstraintRef.current = mouseConstraint;
    World.add(engine.world, mouseConstraint);

    // Create the wheel
    const wheel = Matter.Bodies.circle(400, 200, 50, {
      render: {
        fillStyle: 'blue'
      }
    });

    // Create the rod (increased height)
    const rod = Matter.Bodies.rectangle(400, 100, 10, 200, { // Changed height from 100 to 200
      render: {
        fillStyle: 'red'
      }
    });

    // Create a constraint to attach the rod to the wheel
    const rodConstraint = Matter.Constraint.create({
      bodyA: wheel,
      bodyB: rod,
      pointA: { x: 0, y: -50 }, // Point on the wheel where the rod is attached
      pointB: { x: 0, y: 100 }, // Point on the rod where it is attached to the wheel (adjusted to match new length)
      stiffness: 0.5,
      length: 0
    });

    // Create boundary walls
    const walls = [
      // Top wall
      Bodies.rectangle(width / 2, 0, width, 50, {
        isStatic: true,
        render: {
          fillStyle: 'grey'
        }
      }),
      // Bottom wall
      Bodies.rectangle(width / 2, height, width, 50, {
        isStatic: true,
        render: {
          fillStyle: 'grey'
        }
      }),
      // Left wall
      Bodies.rectangle(0, height / 2, 50, height, {
        isStatic: true,
        render: {
          fillStyle: 'grey'
        }
      }),
      // Right wall
      Bodies.rectangle(width, height / 2, 50, height, {
        isStatic: true,
        render: {
          fillStyle: 'grey'
        }
      })
    ];

    // Add bodies and constraints to the world
    World.add(engine.world, [wheel, rod, rodConstraint, ...walls]);

    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      console.log('Component will unmount');
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Bike</h1>
    </div>
  );
};

export default Bikex;