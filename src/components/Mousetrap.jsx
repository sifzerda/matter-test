import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Events, Constraint, Mouse, MouseConstraint } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const MousetrapGame = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  const ballCountRef = useRef(150); // Track the number of balls
  const rodRef = useRef(null); // Reference to the rod
  const rodAnchorRef = useRef(null); // Reference to the rod anchor point

  window.decomp = decomp;

  useEffect(() => {
    console.log('Component mounted');

    Matter.use(MatterWrap);
    engine.world.gravity.y = 0.35; // Increased gravity

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false,
      },
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create the mousetrap area
    const trapWidth = 300;
    const trapHeight = 20;
    const trapY = 600;

    const trap = Bodies.rectangle(750, trapY, trapWidth, trapHeight, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 3,
      },
    });

    World.add(engine.world, trap);

    // Create the rod
    const rodWidth = 200;
    const rodHeight = 20;
    const rod = Bodies.rectangle(750, trapY - rodHeight / 2, rodWidth, rodHeight, {
      render: {
        fillStyle: '#00ff00',
        strokeStyle: '#000',
        lineWidth: 3,
      },
      density: 0.1, // Make it less dense so it rotates more easily
      isStatic: false // Allow the rod to be dynamic
    });

    rodRef.current = rod; // Store the rod reference

    // Define the anchor point
    const rodAnchor = { x: 750 - rodWidth / 2, y: trapY - rodHeight / 2 };
    rodAnchorRef.current = rodAnchor; // Store the anchor reference

    // Create a constraint to attach one end of the rod to the anchor
    const rodConstraint = Constraint.create({
      pointA: rodAnchor,
      bodyB: rod,
      pointB: { x: -rodWidth / 2, y: 0 }, // Attach to the left end of the rod
      length: 0,
      stiffness: 0.5,
    });

    World.add(engine.world, [rod, rodConstraint]);

    // Setup mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    // Handle mouse click event to simulate spring
    const handleMouseDown = (event) => {
      if (!rodRef.current) return;

      // Check if the mouse is within the rod's bounds
      const mousePosition = event.mouse.position;
      const rodBounds = rodRef.current.bounds;

      if (mousePosition.x > rodBounds.min.x && mousePosition.x < rodBounds.max.x &&
          mousePosition.y > rodBounds.min.y && mousePosition.y < rodBounds.max.y) {
        
        // Apply spring effect by adjusting the constraint
        if (rodConstraint) {
          rodConstraint.length = 100; // Adjust this value to control the spring effect
          rodConstraint.stiffness = 0.7; // Adjust stiffness to control the spring effect

          // Optional: Reset the constraint after a short delay
          setTimeout(() => {
            rodConstraint.length = 0;
            rodConstraint.stiffness = 0.5;
          }, 200); // Delay before resetting
        }
      }
    };

    // Listen for mouse events
    Events.on(mouseConstraint, 'mousedown', handleMouseDown);

    const handleCollisions = (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        if (bodyA === trap || bodyB === trap) {
          const ball = bodyA === trap ? bodyB : bodyA;
          if (ball && ball.label === 'Circle Body') {
            World.remove(engine.world, ball);
            ballCountRef.current -= 1; // Decrement ball count
          }
        }
      }
    };

    Events.on(engine, 'collisionStart', handleCollisions);

    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
      Events.off(engine, 'collisionStart', handleCollisions);
      Events.off(mouseConstraint, 'mousedown', handleMouseDown);
    };

    return () => {
      console.log('Component will unmount');
      cleanup();
    };
  }, [engine]);

  return (
    <div className="game-window" ref={gameRef}>
      <h1>Mousetrap Game</h1>
      <p>Click on the rod to see it spring!</p>
    </div>
  );
};

export default MousetrapGame;