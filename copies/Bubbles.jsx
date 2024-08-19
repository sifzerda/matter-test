import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Ballx = () => {
  const [engine] = useState(Engine.create());
  const [balls, setBalls] = useState([]);
  const gameRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  window.decomp = decomp;

  useEffect(() => {
    Matter.use(MatterWrap);
    engine.world.gravity.y = -0.1;

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

    const createBall = () => {
      const radius = Math.random() * 40 + 5;
      const ball = Bodies.circle(Math.random() * 1500, -radius * 2, radius, {
        restitution: 0.8,
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

    const addBallsGradually = () => {
      const numberOfBalls = 1;
      const newBalls = [];
      for (let i = 0; i < numberOfBalls; i++) {
        newBalls.push(createBall());
      }
      setBalls(prevBalls => [...prevBalls, ...newBalls]);
    };

    const intervalId = setInterval(addBallsGradually, 100);

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

    // Function to create lines
    const createLines = (x, y) => {
      const numLines = 10; // Number of lines to create
      const lines = [];

      for (let i = 0; i < numLines; i++) {
        const angle = Math.random() * 2 * Math.PI; // Angle in radians
        const length = Math.random() * 30 + 10; // Length of lines
        const line = Bodies.rectangle(x, y, 2, length, {
          angle: angle,
          isStatic: true,
          render: {
            fillStyle: '#ffffff',
            strokeStyle: '#ffffff',
            lineWidth: 0.5
          }
        });

        // Update the position of the line based on its angle and length
        Matter.Body.setPosition(line, { x: x, y: y });
        Matter.Body.setAngle(line, angle);

        lines.push(line);
        World.add(engine.world, line);
      }

      // Remove lines after a short delay
      setTimeout(() => {
        World.remove(engine.world, lines);
      }, 100); // Adjust duration as needed
    };

    // Collision detection function
    const handleCollisionStart = (event) => {
      const pairs = event.pairs;

      pairs.forEach(pair => {
        if (pair.bodyA.label === 'Circle Body' && pair.bodyB.label === 'Circle Body') {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          // Get the collision position
          const collisionPoint = {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2
          };

          // Create lines at the collision point
          createLines(collisionPoint.x, collisionPoint.y);

          // Remove bodies from the world
          World.remove(engine.world, [bodyA, bodyB]);

          // Update the state to remove the balls
          setBalls(prevBalls => prevBalls.filter(ball => ball !== bodyA && ball !== bodyB));
        }
      });
    };

    Events.on(engine, 'collisionStart', handleCollisionStart);

    const cleanup = () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
      Events.off(engine, 'collisionStart', handleCollisionStart);
      clearInterval(intervalId);
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
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