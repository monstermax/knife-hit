import { FC } from "react";

import { GameCanvas } from "@/components/GameCanvas";
import { GameOverlay } from "@/components/GameOverlay";
import { GameUI } from "@/components/GameUI";

import type { GameFullState } from "@/types/game";


export const GamePage: FC<{ gameFullState: GameFullState }> = ({ gameFullState }) => {
    const { gameState, throwingKnives, startGame, throwKnife, nextLevel, resetGame, pauseGame, unpauseGame, quitGame } = gameFullState;

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
                onBackHome={quitGame}
            />
        </div>
    );
}

