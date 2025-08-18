import { FC } from "react";

import { GameCanvas } from "@/components/GameCanvas";
import { GameOverlay } from "@/components/GameOverlay";
import { GameUI } from "@/components/GameUI";

import type { GameFullState } from "@/types/game";


export const GamePage: FC<{ gameFullState: GameFullState }> = ({ gameFullState }) => {
    const { gameState, throwingKnives, startGame, throwKnife, nextLevel, resetGame, pauseGame, unpauseGame, quitGame } = gameFullState;

    return (
        <div className="game-container">
            {/* Particules d'arrière-plan */}
            <div className="game-background-particles"></div>
            
            {/* Gradient overlay pour plus de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 pointer-events-none"></div>
            
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
                onBackHome={quitGame}
            />
        </div>
    );
}

