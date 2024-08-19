import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Mouse, MouseConstraint } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Catapultx = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null); // Ensure gameRef is initialized
  const mouseConstraintRef = useRef(null); // Ref to hold the mouse constraint

  window.decomp = decomp; // poly-decomp is available globally

  useEffect(() => {
    console.log('Component mounted or updated');
    Matter.use(MatterWrap);
    engine.world.gravity.y = -0.1; // Set gravity to a small value to simulate gradual dropping

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

export default Catapultx;