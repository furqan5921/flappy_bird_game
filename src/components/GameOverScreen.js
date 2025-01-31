import React from 'react';

const GameOverScreen = ({ score, resetGame }) => {
  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <p>Score: {score}</p>
      <button onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default GameOverScreen;