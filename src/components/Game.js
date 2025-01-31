import React, { useState, useEffect, useCallback } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import ScoreDisplay from './ScoreDisplay';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;

const Game = () => {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const createPipe = useCallback(() => {
    const gapPosition = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x: GAME_WIDTH,
      topHeight: gapPosition,
      bottomHeight: GAME_HEIGHT - gapPosition - PIPE_GAP,
      passed: false
    };
  }, []);

  const checkCollision = (birdY, pipe) => {
    const birdBox = { x: 50, y: birdY, width: 30, height: 30 };
    const topPipeBox = { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.topHeight };
    const bottomPipeBox = { x: pipe.x, y: GAME_HEIGHT - pipe.bottomHeight, width: PIPE_WIDTH, height: pipe.bottomHeight };

    return (
      (birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.y < topPipeBox.y + topPipeBox.height) ||
      (birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.y + birdBox.height > bottomPipeBox.y)
    );
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.code === 'Space' || e.type === 'click') && !gameOver) {
        if (!gameStarted) setGameStarted(true);
        setBirdVelocity(JUMP_FORCE);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [gameOver, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdVelocity((v) => v + GRAVITY);
      setBirdPosition((p) => Math.max(0, Math.min(p + birdVelocity, GAME_HEIGHT - 30)));

      setPipes((pipes) => {
        const updatedPipes = pipes.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED })).filter((pipe) => pipe.x > -PIPE_WIDTH);

        if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < GAME_WIDTH - 200) {
          updatedPipes.push(createPipe());
        }

        updatedPipes.forEach((pipe) => {
          if (checkCollision(birdPosition, pipe)) {
            setGameOver(true);
          }
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            pipe.passed = true;
            setScore((s) => s + 1);
          }
        });

        return updatedPipes;
      });

      if (birdPosition >= GAME_HEIGHT - 30) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [birdPosition, gameOver, gameStarted, createPipe, birdVelocity]);

  const resetGame = () => {
    setBirdPosition(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="game-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <Bird birdPosition={birdPosition} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} pipe={pipe} />
      ))}
      {!gameStarted && <StartScreen />}
      {gameOver && <GameOverScreen score={score} resetGame={resetGame} />}
      <ScoreDisplay score={score} />
    </div>
  );
};

export default Game;