import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200;

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameLoopRef = useRef();

  useEffect(() => {
    // Generate initial random position for the food after the component mounts
    setFood(randomPosition());
    startGame();
    return () => stopGame();
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      handleMovement();
    }
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          setDirection(Direction.RIGHT);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startGame = () => {
    gameLoopRef.current = setInterval(() => moveSnake(), speed);
  };

  const stopGame = () => {
    clearInterval(gameLoopRef.current);
  };

  const randomPosition = () => ({
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  });

  const moveSnake = () => {
    const newHead = { ...snake[0] };
    switch (direction) {
      case Direction.UP:
        newHead.y -= 1;
        break;
      case Direction.DOWN:
        newHead.y += 1;
        break;
      case Direction.LEFT:
        newHead.x -= 1;
        break;
      case Direction.RIGHT:
        newHead.x += 1;
        break;
      default:
        break;
    }
    const newSnake = [newHead, ...snake.slice(0, -1)];
    setSnake(newSnake);

    if (isCollided(newHead)) {
      setIsGameOver(true);
      stopGame();
    }

    if (isEatingFood(newHead)) {
      growSnake();
      setFood(randomPosition());
      increaseSpeed();
    }
  };

  const isCollided = (head) => {
    return (
      head.x < 0 ||
      head.x >= COLS ||
      head.y < 0 ||
      head.y >= ROWS ||
      snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  const isEatingFood = (head) => {
    return head.x === food.x && head.y === food.y;
  };

  const growSnake = () => {
    const newSegment = { ...snake[snake.length - 1] };
    setSnake([...snake, newSegment]);
  };

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => Math.max(50, prevSpeed - 5));
  };

  const handleMovement = () => {
    if (isGameOver) return;
    moveSnake();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-black rounded-lg p-4">
        {isGameOver && <div className="text-3xl text-red-500 font-bold text-center">Game Over</div>}
        <div className="grid grid-cols-20 gap-1">
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: COLS }).map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-${CELL_SIZE} h-${CELL_SIZE} border border-gray-400 ${
                    snake.some((segment) => segment.x === colIndex && segment.y === rowIndex) ? 'bg-green-500' : ''
                  } ${
                    food.x === colIndex && food.y === rowIndex ? 'bg-red-500' : ''
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
