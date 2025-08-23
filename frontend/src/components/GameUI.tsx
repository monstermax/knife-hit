import React from 'react';

import { Apple } from './svg';

import type { GameState } from '../types/game';


interface GameUIProps {
  gameState: GameState;
  onQuitGame?: () => void;
}


export const GameUI: React.FC<GameUIProps> = ({ gameState, onQuitGame }) => {
  const renderStageTitle = () => {
    if (gameState.isBossLevel) {
      return (
        <div className="stage-display">
          <div className="text-red-400 text-sm font-bold">🍋 BOSS LEVEL</div>
        </div>
      );
    }

    return (
      <div className="stage-display">
        <div className="text-white">STAGE {gameState.level}</div>
      </div>
    );
  };

  return (
    <div className="game-ui">
      {/* Score */}
      <div className="bg-black/25 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30 shadow-lg">
        <div className="score-display flex items-center gap-2">
          <span className="text-yellow-400 text-lg">💰</span>
          <span className="text-xl font-bold text-yellow-300 drop-shadow-lg">{gameState.score}</span>
        </div>
      </div>

      {/* Stage title */}
      <div className="bg-black/25 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
        {renderStageTitle()}
      </div>

      {/* Section droite avec apple counter et bouton quit */}
      <div className="flex items-center gap-3">
        {/* Apple counter */}
        <div className="bg-black/25 backdrop-blur-sm px-3 py-2 rounded-xl border border-green-400/30 shadow-lg">
          <div className="apple-display flex items-center gap-2">
            <Apple size={20} />
            <span className="text-lg font-bold text-green-300 drop-shadow-lg">{gameState.totalApples}</span>
          </div>
        </div>

        {/* Bouton Quit Game */}
        {onQuitGame && (
          <button
            onClick={onQuitGame}
            className="bg-black/25 backdrop-blur-sm px-3 py-2 rounded-xl border border-red-400/30 shadow-lg hover:bg-red-500/20 transition-all duration-200 group cursor-pointer"
            title="Leave game"
          >
            <span className="text-red-400 group-hover:text-red-300 text-lg">🚪</span>
          </button>
        )}
      </div>
    </div>
  );
};

