import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events } from 'matter-js';
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

    // Helper function to generate a random color
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Helper function to create a ball with a random color
    const createBall = () => {
      const radius = Math.random() * 40 + 5; // Random radius between 5 and 45
      const ball = Bodies.circle(Math.random() * 1500, -radius * 2, radius, { // Start above the screen
        restitution: 1.1, // Bounciness of the ball
        friction: 0.1,
        frictionAir: 0.01,
        render: {
          fillStyle: 'transparent',
          strokeStyle: getRandomColor(),
          lineWidth: 3
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
    
    // Function to add a fixed number of balls
    const addInitialBalls = (numBalls) => {
      const newBalls = [];
      for (let i = 0; i < numBalls; i++) {
        newBalls.push(createBall());
      }
      setBalls(newBalls); // Set balls state to the new balls array
    };

    // Add 150 balls initially
    addInitialBalls(150);

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

    // Create two platforms side by side and rotate them
    const platformWidth = 300;
    const platformHeight = 20;
    const platformDistance = 50; // Space between the two platforms
    const angle1 = Math.PI / 8; // 45 degrees in radians
    const angle2 = Math.PI / -8; // -45 degrees in radians

    const platform1 = Bodies.rectangle(750 - (platformWidth / 2) - platformDistance, 340, platformWidth, platformHeight, {
        isStatic: true,
        angle: angle1, // Rotate by 45 degrees
        render: {
          fillStyle: '#8B4513', // Brown color for the platform
          strokeStyle: '#000',
          lineWidth: 1
        }
      });
  
    const platform2 = Bodies.rectangle(750 + (platformWidth / 2) + platformDistance, 340, platformWidth, platformHeight, {
      isStatic: true,
      angle: angle2, // Rotate by -45 degrees
      render: {
        fillStyle: '#8B4513', // Brown color for the platform
        strokeStyle: '#000',
        lineWidth: 1
      }
    });

    World.add(engine.world, [platform1, platform2]);

    // Create the 3-walled box
    const boxWidth = 400;
    const boxHeight = 300;
    const boxX = 750;
    const boxY = 500;

    const boxLeftWall = Bodies.rectangle(boxX - boxWidth / 2, boxY, 20, boxHeight, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1
      }
    });

    const boxRightWall = Bodies.rectangle(boxX + boxWidth / 2, boxY, 20, boxHeight, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1
      }
    });

    const boxBottomWall = Bodies.rectangle(boxX, boxY + boxHeight / 2, boxWidth, 20, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1
      }
    });

    World.add(engine.world, [boxLeftWall, boxRightWall, boxBottomWall]);

    // Remove balls that fall into the box
    const removeBallsInBox = () => {
      for (const ball of balls) {
        if (Matter.SAT.collides(ball, boxBottomWall).collided && ball.position.y > boxBottomWall.position.y) {
          World.remove(engine.world, ball);
          setBalls(prevBalls => prevBalls.filter(b => b !== ball));
        }
      }
    };

    // Set up an event listener to remove balls within the box on every update
    Events.on(engine, 'afterUpdate', removeBallsInBox);

    // Cleanup function
    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
      Events.off(engine, 'afterUpdate', removeBallsInBox); // Remove the event listener
    };

    // Attach cleanup function to the window's beforeunload event
    window.addEventListener('beforeunload', cleanup);

    return () => {
      console.log('Component will unmount');
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [engine]); // Avoid including `balls` to prevent unnecessary re-renders

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Ball Pit</h1>
      <p>Click and drag to interact with the balls</p>
    </div>
  );
};


export default Ballx;