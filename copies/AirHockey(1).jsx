// this has the air hockey game, minus air hockey opponent

import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Events, Query } from 'matter-js';
import MatterWrap from 'matter-wrap';

const AirHockey = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null);
  const [leftPaddle, setLeftPaddle] = useState(null);
  const [rightPaddle, setRightPaddle] = useState(null);
  const [puck, setPuck] = useState(null);
  const [score, setScore] = useState({ left: 0, right: 0 });

  useEffect(() => {
    Matter.use(MatterWrap);
    engine.world.gravity.y = 0; // No gravity 

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create the air hockey table
    const tableWidth = 800;
    const tableHeight = 600;
    const tableThickness = 20;
    
    const table = [
      Bodies.rectangle(tableWidth / 2, tableThickness / 2, tableWidth, tableThickness, { isStatic: true }), // Top border
      Bodies.rectangle(tableWidth / 2, tableHeight - tableThickness / 2, tableWidth, tableThickness, { isStatic: true }), // Bottom border
      Bodies.rectangle(tableThickness / 2, tableHeight / 2, tableThickness, tableHeight, { isStatic: true }), // Left border
      Bodies.rectangle(tableWidth - tableThickness / 2, tableHeight / 2, tableThickness, tableHeight, { isStatic: true }) // Right border
    ];

    // Create goals
    const goalWidth = 100;
    const goalDepth = 10;
    const goals = [
      Bodies.rectangle(goalWidth / 2, tableHeight / 2, goalDepth, tableHeight, { 
        isStatic: true, 
        isSensor: true, 
        render: { fillStyle: '#f00' } }), // Left goal
      Bodies.rectangle(tableWidth - goalWidth / 2, tableHeight / 2, goalDepth, tableHeight, { 
        isStatic: true, 
        isSensor: true, 
        render: { 
          fillStyle: '#00f' } }), // Right goal
    ];
    World.add(engine.world, [...table, ...goals]);

    // Create paddles
    const paddleRadius = 30;
    const paddleOptions = { friction: 0.2, restitution: 1.0 };
    const leftPaddle = Bodies.circle(100, tableHeight / 2, paddleRadius, paddleOptions);
    const rightPaddle = Bodies.circle(tableWidth - 100, tableHeight / 2, paddleRadius, paddleOptions);
    World.add(engine.world, [leftPaddle, rightPaddle]);
    setLeftPaddle(leftPaddle);
    setRightPaddle(rightPaddle);

    // Create the puck
    const puck = Bodies.circle(tableWidth / 2, tableHeight / 2, 20, { friction: 0.05, restitution: 1.0 });
    World.add(engine.world, puck);
    setPuck(puck);

    // Handle mouse movement for paddles
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);

    // Update paddle positions based on mouse movement
    Events.on(engine, 'beforeUpdate', () => {
      if (mouseConstraint.body === leftPaddle) {
        Body.setPosition(leftPaddle, { x: mouse.position.x, y: leftPaddle.position.y });
      }
      if (mouseConstraint.body === rightPaddle) {
        Body.setPosition(rightPaddle, { x: mouse.position.x, y: rightPaddle.position.y });
      }

      // Check for goals
      if (isPuckInGoal(puck, goals[0])) {
        // Right player scores
        setScore(prevScore => ({ ...prevScore, right: prevScore.right + 1 }));
        resetPuck();
      }
      if (isPuckInGoal(puck, goals[1])) {
        // Left player scores
        setScore(prevScore => ({ ...prevScore, left: prevScore.left + 1 }));
        resetPuck();
      }
    });

    // Function to check if puck is in goal
    const isPuckInGoal = (puck, goal) => {
      return Query.region([puck], goal.bounds).length > 0;
    };

    // Function to reset puck position
    const resetPuck = () => {
      Body.setPosition(puck, { x: tableWidth / 2, y: tableHeight / 2 });
      Body.setVelocity(puck, { x: 0, y: 0 });
    };

    // Cleanup function
    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      World.remove(engine.world, mouseConstraint);
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
      <h1>Air Hockey</h1>
      <p>Move the paddles with your mouse to hit the puck!</p>
      <div>
        <h2>Score</h2>
        <p>Left Player: {score.left} - Right Player: {score.right}</p>
      </div>
    </div>
  );
};

export default AirHockey;