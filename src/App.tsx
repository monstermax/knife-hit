import React from 'react';

import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { GameOverlay } from './components/GameOverlay';
import { useGameState } from './hooks/useGameState';

import './App.css';


function App() {
    const { gameState, throwingKnives, startGame, nextLevel, resetGame, throwKnife, pauseGame, unpauseGame } = useGameState();

    return (
        <div className="game-container">
            <GameUI gameState={gameState} />

            {(gameState.gameStatus === 'playing' || 1) && (
                <GameCanvas
                    gameState={gameState}
                    throwingKnives={throwingKnives}
                    onThrowKnife={throwKnife}
                />
            )}

            <GameOverlay
                gameState={gameState}
                onStartGame={startGame}
                onNextLevel={nextLevel}
                onResetGame={resetGame}
                pauseGame={pauseGame}
                unpauseGame={unpauseGame}
            />
        </div>
    );
}


export default App;

