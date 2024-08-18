import { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Composite, Composites, Common, Mouse, MouseConstraint, Bodies } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Ballx = () => {
  const engine = useRef(Engine.create()).current;
  const gameRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
    // Initialize the MatterWrap plugin
    try {
      Matter.use(MatterWrap);
    } catch (e) {
      console.error('Could not load MatterWrap plugin:', e);
    }

    const world = engine.world;

    // Create renderer
    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false
      }
    });
    renderRef.current = render;
    Render.run(render);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Add bodies
    const stack = Composites.stack(20, 20, 20, 5, 0, 0, (x, y) => {
      return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
    });
    Composite.add(world, stack);

    Composite.add(world, [
      Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: -Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(340, 580, 700, 20, { isStatic: true, angle: Math.PI * 0.04, render: { fillStyle: '#060a19' } })
    ]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(world, mouseConstraint);

    // Fit the render viewport to the scene
    Render.lookAt(render, Composite.allBodies(world));

    // Apply wrapping using matter-wrap plugin
    stack.bodies.forEach(body => {
      body.plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y }
      };
    });

    // Cleanup function
    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      if (mouseConstraintRef.current) {
        Composite.remove(world, mouseConstraintRef.current);
        mouseConstraintRef.current = null;
      }
    };

    // Cleanup on component unmount
    return () => {
      console.log('Component will unmount');
      cleanup();
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}></div>
  );
};

export default Ballx;