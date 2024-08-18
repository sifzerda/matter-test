import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Composite, Bodies, Constraint, Mouse, MouseConstraint, Body } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

// Define Example.car function within the component
const ExampleCar = (xx, yy, width, height, wheelSize) => {
  const group = Body.nextGroup(true);
  const wheelBase = 20;
  const wheelAOffset = -width * 0.5 + wheelBase;
  const wheelBOffset = width * 0.5 - wheelBase;
  const wheelYOffset = 0;

  var car = Composite.create({ label: 'Car' }),
  body = Bodies.rectangle(xx, yy, width, height, { 
      collisionFilter: {
          group: group
      },
      chamfer: {
          radius: height * 0.5
      },
      density: 0.0002
  });

  var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, { 
    collisionFilter: {
        group: group
    },
    friction: 0.8
});
            
var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, { 
    collisionFilter: {
        group: group
    },
    friction: 0.8
});
  
  var axelA = Constraint.create({
    bodyB: body,
    pointB: { x: wheelAOffset, y: wheelYOffset },
    bodyA: wheelA,
    stiffness: 1,
    length: 0
});
                
var axelB = Constraint.create({
    bodyB: body,
    pointB: { x: wheelBOffset, y: wheelYOffset },
    bodyA: wheelB,
    stiffness: 1,
    length: 0
});

  Composite.addBody(car, body);
  Composite.addBody(car, wheelA);
  Composite.addBody(car, wheelB);
  Composite.addConstraint(car, axelA);
  Composite.addConstraint(car, axelB);

  return car;
};

const Car = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);

  useEffect(() => {
    window.decomp = decomp;

    Matter.use(MatterWrap);
    engine.world.gravity.y = 1.0;

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: true
      }
    });
    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add bodies and car to the world
    Composite.add(engine.world, [
        // walls
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // Create and add cars
    const scale1 = 0.9;
    Composite.add(engine.world, ExampleCar(150, 100, 150 * scale1, 30 * scale1, 30 * scale1));
    
    const scale2 = 0.8;
    Composite.add(engine.world, ExampleCar(350, 300, 150 * scale2, 30 * scale2, 30 * scale2));
    
    Composite.add(engine.world, [
        Bodies.rectangle(200, 150, 400, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' }}),
        Bodies.rectangle(500, 350, 650, 20, { isStatic: true, angle: -Math.PI * 0.06, render: { fillStyle: '#060a19' }}),
        Bodies.rectangle(300, 560, 600, 20, { isStatic: true, angle: Math.PI * 0.04, render: { fillStyle: '#060a19' }})
    ]);

    // Add mouse control
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

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 1500, y: 680 }
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      engine.world.bodies.forEach(body => {
        Composite.remove(engine.world, body);
      });
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Car</h1>
      <p>Click and drag to interact with the cars</p>
    </div>
  );
};

export default Car;