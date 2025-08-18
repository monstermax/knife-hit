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
      {/* Score avec effet glassmorphism */}
      <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30 shadow-lg">
        <div className="score-display flex items-center gap-2">
          <span className="text-yellow-400 text-sm">💰</span>
          <span className="text-2xl font-bold text-yellow-300 drop-shadow-lg">{gameState.score}</span>
        </div>
      </div>

      {/* Stage title amélioré */}
      <div className="bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 shadow-lg">
        {renderStageTitle()}
      </div>

      {/* Apple counter modernisé */}
      <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30 shadow-lg">
        <div className="apple-display flex items-center gap-2">
          <Apple size={24} />
          <span className="text-xl font-bold text-green-300 drop-shadow-lg">{gameState.totalApples}</span>
        </div>
      </div>
    </div>
  );
};

