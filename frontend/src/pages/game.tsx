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

            {/* Cadre principal du jeu */}
            <div className="game-frame">
                {/* Header avec UI */}
                <div className="game-header">
                    <GameUI gameState={gameState} onQuitGame={quitGame} />
                </div>

                {/* Zone de jeu principale */}
                <div className="game-play-area">
                    {(gameState.gameStatus === 'playing' || gameState.gameStatus === 'pause') && (
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
            </div>
        </div>
    );
}
