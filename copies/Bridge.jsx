import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Body, Composites, Common, Constraint, MouseConstraint, Mouse, Composite, Bodies } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Bridge = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);

  useEffect(() => {
    window.decomp = decomp;
  }, []);

  useEffect(() => {
    Matter.use(MatterWrap);
    engine.world.gravity.y = 1.0;

    // Setup the renderer and runner
    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false
      }
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create the bridge
    const group = Body.nextGroup(true);

    const bridge = Composites.stack(160, 290, 15, 1, 0, 0, (x, y) => {
      return Bodies.rectangle(x - 20, y, 53, 20, { 
        collisionFilter: { group },
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
        render: {
          fillStyle: '#060a19',
          strokeStyle: 'white',
          lineWidth: 2
        }
      });
    });

    // Connect the bridge with constraints
    Composites.chain(bridge, 0.3, 0, -0.3, 0, { 
      stiffness: 0.99,
      length: 0.0001,
      render: {
        visible: true, // Set to true to display the constraints
        strokeStyle: '#ff0000', // Red color for the constraints
        lineWidth: 2 // Adjust line width if necessary
      }
    });

    // Add the stack of transparent boxes
    const stack = Composites.stack(250, 50, 6, 3, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 50, 50, {
        render: {
          fillStyle: 'transparent', // Make the box fill transparent
          strokeStyle: 'white', // White stroke for the boxes
          lineWidth: 2
        }
      });
    });

    Composite.add(engine.world, [
      bridge,
      stack,
      Bodies.rectangle(30, 490, 220, 380, { 
        isStatic: true, 
        chamfer: { radius: 20 },
        render: {
          fillStyle: '#060a19',
          strokeStyle: 'white',
          lineWidth: 2
        }
      }),
      Bodies.rectangle(770, 490, 220, 380, { 
        isStatic: true, 
        chamfer: { radius: 20 },
        render: {
          fillStyle: '#060a19',
          strokeStyle: 'white',
          lineWidth: 2
        }
      }),
      Constraint.create({ 
        pointA: { x: 140, y: 300 }, 
        bodyB: bridge.bodies[0], 
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.9
      }),
      Constraint.create({ 
        pointA: { x: 660, y: 300 }, 
        bodyB: bridge.bodies[bridge.bodies.length - 1], 
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.9
      })
    ]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.1,
        render: {
          visible: true,
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 1500, y: 680 }
    });

    // Cleanup function
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      // No need to call Render.destroy since it's not a standard method
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Bridge</h1>
      <p>Click and drag to interact</p>
    </div>
  );
};

export default Bridge;