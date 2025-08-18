import React from 'react';

import { Apple } from './svg';

import type { GameState } from '../types/game';


interface GameUIProps {
  gameState: GameState;
}


export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  const renderStageTitle = () => {
    if (gameState.isBossLevel) {
      return (
        <div className="stage-display">
          <div className="text-red-400 text-sm">BOSS: LEMON</div>
        </div>
      );
    }

    return (
      <div className="stage-display">
        <div>STAGE {gameState.level}</div>
      </div>
    );
  };

  return (
    <div className="game-ui">
      <div className="score-display">
        {gameState.score}
      </div>

      {renderStageTitle()}

      <div className="apple-display">
        <span>{gameState.totalApples}</span>
        <Apple size={20} />
      </div>
    </div>
  );
};

