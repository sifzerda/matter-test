import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

// Define Tetris block shapes and rotations
const TETROMINOES = {
  I: [
    [[1, 1, 1, 1]]
  ],
  J: [
    [[0, 0, 1], [1, 1, 1]]
  ],
  L: [
    [[1, 0, 0], [1, 1, 1]]
  ],
  O: [
    [[1, 1], [1, 1]]
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]]
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]]
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]]
  ]
};

const Catapultx = () => {
  const [engine] = useState(Engine.create());
  const gameRef = useRef(null); // Ensure gameRef is initialized
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [tetrominoPosition, setTetrominoPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    Matter.use(MatterWrap);
    engine.world.gravity.y = 0; // No gravity for Tetris

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

    // Function to create a tetromino
    const createTetromino = (type) => {
      const shape = TETROMINOES[type][0];
      const blocks = [];

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const block = Bodies.rectangle(
              (col + tetrominoPosition.x) * 30, 
              (row + tetrominoPosition.y) * 30, 
              30, 
              30, 
              {
                render: {
                  fillStyle: 'red' // Change color as needed
                }
              }
            );
            blocks.push(block);
          }
        }
      }

      World.add(engine.world, blocks);
      setCurrentTetromino({ type, blocks });
    };

    // Handle key press events for block movement
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setTetrominoPosition(prev => ({ x: prev.x - 1, y: prev.y }));
      } else if (event.key === 'ArrowRight') {
        setTetrominoPosition(prev => ({ x: prev.x + 1, y: prev.y }));
      } else if (event.key === 'ArrowDown') {
        setTetrominoPosition(prev => ({ x: prev.x, y: prev.y + 1 }));
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Initialize the game
    createTetromino('I'); // Start with 'I' shape

    // Cleanup function
    const cleanup = () => {
      console.log('Cleaning up...');
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      document.removeEventListener('keydown', handleKeyPress);
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      console.log('Component will unmount');
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [engine, tetrominoPosition]);

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Tetris</h1>
      <p>Use arrow keys to move the blocks</p>
    </div>
  );
};

export default Catapultx;