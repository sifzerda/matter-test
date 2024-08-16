import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Ballx = () => {
  const [engine] = useState(Engine.create());
  const [balls, setBalls] = useState([]);
  const gameRef = useRef(null); // Ensure gameRef is initialized
  const mouseConstraintRef = useRef(null); // Ref to hold the mouse constraint

  window.decomp = decomp; // poly-decomp is available globally

  useEffect(() => {
    console.log('Component mounted or updated');
    Matter.use(MatterWrap);
    engine.world.gravity.y = 0.1; // Set gravity to a small value to simulate gradual dropping

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

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Helper function to create a ball
    const createBall = () => {
      const radius = Math.random() * 40 + 5; // Random radius between 5 and 45
      const ball = Bodies.circle(Math.random() * 1500, -radius * 2, radius, { // Start above the screen
        restitution: 0.8, // Bounciness of the ball
        friction: 0.1,
        frictionAir: 0.01,
        render: {
          fillStyle: 'transparent',
          strokeStyle: '#ffffff',
          lineWidth: 2
        },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: 1500, y: 680 }
          }
        }
      });

      World.add(engine.world, ball);

      return ball;
    };

    // Function to add balls gradually
    const addBallsGradually = () => {
      const numberOfBalls = 1; // Number of balls to add each interval
      const newBalls = [];
      for (let i = 0; i < numberOfBalls; i++) {
        newBalls.push(createBall());
      }
      setBalls(prevBalls => [...prevBalls, ...newBalls]);
    };

    // Add balls every 100 milliseconds
    const intervalId = setInterval(addBallsGradually, 100);

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

    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
      clearInterval(intervalId); // Clear the interval when cleaning up
    };

    // Attach cleanup function to the window's beforeunload event
    window.addEventListener('beforeunload', cleanup);

    return () => {
      console.log('Component will unmount');
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Bubbles</h1>
      <p>Click and drag to interact with the bubbles</p>
    </div>
  );
};

export default Ballx;