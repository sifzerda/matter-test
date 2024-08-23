import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events, Constraint } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Ballx = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  const ballCountRef = useRef(150); // Track the number of balls

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

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const createBall = () => {
      const radius = Math.random() * 30 + 5;
      const ball = Bodies.circle(Math.random() * 1500, -radius * 2, radius, {
        restitution: 0.5,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.1, // Increased density
        render: {
          fillStyle: 'transparent',
          strokeStyle: getRandomColor(),
          lineWidth: 3,
        },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: 1500, y: 680 },
          },
        },
      });
      World.add(engine.world, ball);
      ballCountRef.current += 1; // Increment ball count
      return ball;
    };

    const addInitialBalls = (numBalls) => {
      for (let i = 0; i < numBalls; i++) {
        createBall();
      }
    };

    addInitialBalls(ballCountRef.current);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    World.add(engine.world, mouseConstraint);

    const platformWidth = 300;
    const platformHeight = 10;
    const platformDistance = 50;
    const angle1 = Math.PI / 5;
    const angle2 = Math.PI / -5;

    const platformY = 500;

    const platform1 = Bodies.rectangle(750 - (platformWidth / 2) - platformDistance, platformY, platformWidth, platformHeight, {
      isStatic: true,
      angle: angle1,
      render: {
        fillStyle: '#8B4513',
        strokeStyle: '#000',
        lineWidth: 1,
      },
    });

    const platform2 = Bodies.rectangle(750 + (platformWidth / 2) + platformDistance, platformY, platformWidth, platformHeight, {
      isStatic: true,
      angle: angle2,
      render: {
        fillStyle: '#8B4513',
        strokeStyle: '#000',
        lineWidth: 1,
      },
    });

    World.add(engine.world, [platform1, platform2]);

    const boxWidth = 100;
    const boxHeight = 50;
    const boxX = 750;
    const boxY = 640;

    const boxLeftWall = Bodies.rectangle(boxX - boxWidth / 2, boxY, 20, boxHeight, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1,
      },
    });

    const boxRightWall = Bodies.rectangle(boxX + boxWidth / 2, boxY, 20, boxHeight, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1,
      },
    });

    const boxBottomWall = Bodies.rectangle(boxX, boxY + boxHeight / 3, boxWidth, 20, {
      isStatic: true,
      render: {
        fillStyle: '#ff0000',
        strokeStyle: '#000',
        lineWidth: 1,
      },
    });

    World.add(engine.world, [boxLeftWall, boxRightWall, boxBottomWall]);

    // Spinning Platforms
    const spinningPlatformLength = 280; // Increased length of the platforms
    const spinningPlatformWidth = 10;   // Width of the platforms
    const spinningPlatformY = 300;      // Y position of the platforms

    const createSpinningPlatform = (x) => {
      const platform = Bodies.rectangle(x, spinningPlatformY, spinningPlatformLength, spinningPlatformWidth, {
        angle: 0,
        render: {
          fillStyle: '#228B22',
          strokeStyle: '#000',
          lineWidth: 1,
        },
      });

      const anchor = Bodies.circle(x, spinningPlatformY, 5, {
        isStatic: true,
        render: {
          visible: true,
        },
      });

      const constraint = Constraint.create({
        bodyA: anchor,
        bodyB: platform,
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 },
        stiffness: 1,
        render: {
          visible: false,
        },
      });

      World.add(engine.world, [platform, anchor, constraint]);

      return platform;
    };

    const spinningPlatform1 = createSpinningPlatform(600);
    const spinningPlatform2 = createSpinningPlatform(900);

    const handleCollisions = (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        if (bodyA === boxBottomWall || bodyB === boxBottomWall) {
          const ball = bodyA === boxBottomWall ? bodyB : bodyA;
          if (ball && ball.label === 'Circle Body') {
            World.remove(engine.world, ball);
            createBall(); // Create a new ball to replace the removed one
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
      Mouse.clear(mouse);
      World.remove(engine.world, mouseConstraintRef.current);
      mouseConstraintRef.current = null;
      Events.off(engine, 'collisionStart', handleCollisions);
    };

    return () => {
      console.log('Component will unmount');
      cleanup();
    };
  }, [engine]);

  return (
    <div className="game-window" ref={gameRef}>
      <h1>Ball Pit</h1>
      <p>Click and drag to interact with the balls</p>
    </div>
  );
};

export default Ballx;