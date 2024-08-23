import React, { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Events, Query } from 'matter-js';
import MatterWrap from 'matter-wrap';
import PropTypes from 'prop-types'; // Import PropTypes

// START SCREEN ==================================================//
const StartScreen = ({ onStart }) => {
  const [aiDifficulty, setAiDifficulty] = useState(2); // Default difficulty is 2

  const handleDifficultyChange = (event) => {
    setAiDifficulty(Number(event.target.value));
  };

  const handleStartClick = () => {
    onStart(aiDifficulty); // Pass the selected difficulty to the start game handler
  };

  return (
    <div className="start-screen">
      <h1>Air Hockey in Matter.js</h1>
      <p>With AI opponent</p>
      <div>
        <h2>Select Difficulty</h2>
        <label>
          <input
            type="radio"
            value="1"
            checked={aiDifficulty === 1}
            onChange={handleDifficultyChange}
          />
          Easy
        </label>
        <label>
          <input
            type="radio"
            value="2"
            checked={aiDifficulty === 2}
            onChange={handleDifficultyChange}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            value="3"
            checked={aiDifficulty === 3}
            onChange={handleDifficultyChange}
          />
          Hard
        </label>
      </div>
      <button onClick={handleStartClick}>Start Game</button>
    </div>
  );
};

// Define PropTypes for StartScreen
StartScreen.propTypes = {
  onStart: PropTypes.func.isRequired, // Validate that onStart is a required function
};

// ==================================== MAIN GAME ==========================//

// Define the AirHockey component
const AirHockey = () => {
  const [engine] = useState(Engine.create());
  const [gameActive, setGameActive] = useState(false); // Track game state
  const gameRef = useRef(null);
  const [leftPaddle, setLeftPaddle] = useState(null);
  const [rightPaddle, setRightPaddle] = useState(null);
  const [puck, setPuck] = useState(null);
  const [score, setScore] = useState({ left: 0, right: 0 });
  const [aiDifficulty, setAiDifficulty] = useState(2); // Default difficulty is 2

  useEffect(() => {
    if (!gameActive) return;

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
      Bodies.rectangle(tableWidth - tableThickness / 2, tableHeight / 2, tableThickness, tableHeight, { isStatic: true }), // Right border
      Bodies.rectangle(tableWidth / 2, tableHeight / 2, 10, tableHeight, { isStatic: true, isSensor: true, render: { fillStyle: '#aaa' } }) // Center line
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
        render: { fillStyle: '#00f' } }), // Right goal
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

    // Handle mouse movement for left paddle
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);

    // Update paddle positions based on mouse movement and AI behavior
    Events.on(engine, 'beforeUpdate', () => {
      // Update the left paddle based on mouse movement
      if (mouseConstraint.body === leftPaddle) {
        const newY = Math.max(
          Math.min(mouse.position.y, tableHeight / 2 - paddleRadius),
          tableHeight / 2 - tableHeight + paddleRadius
        );
        Body.setPosition(leftPaddle, { x: leftPaddle.position.x, y: newY });
      }

      // AI Movement for the right paddle
      if (rightPaddle) {
        const puckY = puck.position.y;
        const paddleY = rightPaddle.position.y;
        const paddleSpeed = 2 + aiDifficulty; // Adjust AI speed based on difficulty
        const predictiveFactor = 0.2 / aiDifficulty; // Adjust prediction accuracy based on difficulty

        // Predict puck position based on its velocity
        const puckVelocity = puck.velocity;
        const predictedPuckY = puckY + puckVelocity.y * predictiveFactor;

        // Smooth AI movement
        if (predictedPuckY > paddleY + 10) {
          Body.setPosition(rightPaddle, { 
            x: rightPaddle.position.x, 
            y: Math.min(paddleY + paddleSpeed, tableHeight / 2 - paddleRadius) 
          });
        } else if (predictedPuckY < paddleY - 10) {
          Body.setPosition(rightPaddle, { 
            x: rightPaddle.position.x, 
            y: Math.max(paddleY - paddleSpeed, tableHeight / 2 + paddleRadius) 
          });
        }
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
  }, [engine, aiDifficulty, gameActive]); // Re-run effect when aiDifficulty or gameActive changes

  const startGame = (difficulty) => {
    setAiDifficulty(difficulty);
    setGameActive(true); // Set game state to active
  };

  const goToMenu = () => {
    setGameActive(false); // Set game state to inactive
  };

  return (
    <div className="game-container">
      {!gameActive ? (
        <StartScreen onStart={startGame} />
      ) : (
        <div className="game-window" ref={gameRef}>
          <h1>Air Hockey</h1>
          <div>
            <button onClick={goToMenu}>Menu</button>
            <h2>Score</h2>
            <p>Left Player: {score.left} - Right Player: {score.right}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirHockey;