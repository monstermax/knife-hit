import React, { useEffect } from 'react';
import { usePrivy, useLogin, useLogout, useWallets } from '@privy-io/react-auth';

import type { GameState } from '../types/game';
import MonadGamesId from '@/components/MonadGamesId';


interface GameOverlayProps {
    gameState: GameState;
    onStartGame: () => void;
    onNextLevel: () => void;
    onResetGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
}


const debug = false;


export const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    onStartGame,
    onNextLevel,
    onResetGame,
    pauseGame,
    unpauseGame,
}) => {

    useEffect(() => {
        if (gameState.gameStatus === 'levelComplete') {
            const timer = setTimeout(onNextLevel, 500);
            return () => clearTimeout(timer);
        }
    }, [gameState.gameStatus])

    if (gameState.gameStatus === 'menu') {
        return (
            <div className="game-over-overlay">
                <h1 className="text-4xl font-bold mb-8 text-white">Knife Hit</h1>
                <p className="text-lg mb-8 text-center max-w-md">
                    Throw knives at the rotating target. Avoid hitting other knives!
                    Collect apples for bonus points.
                </p>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
                    onClick={onStartGame}
                >
                    Start Game
                </button>
                <div className="mt-4 text-sm text-gray-300">
                    Apples collected: {gameState.totalApples}
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'gameOver') {
        return (
            <div className="game-over-overlay">
                <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over!</h2>
                <p className="text-lg mb-2">Level: {gameState.level}</p>
                <p className="text-lg mb-2">Score: {gameState.score}</p>
                <p className="text-lg mb-8">Total Apples: {gameState.totalApples}</p>
                <div className="flex gap-4">
                    <button
                        onClick={onResetGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={onResetGame}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'levelComplete') {

        return (
            <div className="level-complete-overlay">
                <h2 className="text-3xl font-bold mb-4 text-green-400">
                    {gameState.isBossLevel ? 'Boss Defeated!' : 'Level Complete!'}
                </h2>
                <p className="text-lg mb-2">Level: {gameState.level}</p>
                <p className="text-lg mb-2">Score: {gameState.score}</p>
                <p className="text-lg mb-8">Total Apples: {gameState.totalApples}</p>
                <button
                    onClick={onNextLevel}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
                >
                    Next Level
                </button>
            </div>
        );
    }

    if (debug && (gameState.gameStatus === 'playing' || gameState.gameStatus === 'pause')) {
        // DEBUG

        //const impactAngle = (180 - gameState.targetRotation) % 360;
        const impactAngle = (180 + gameState.targetRotation) % 360;

        return (
            <div style={{
                position: 'absolute',
                top: '100px',
                left: '100px',
                backgroundColor: 'white',
            }}>
                target angle: {Math.round(gameState.targetRotation)}
                <hr />
                impact angle: {Math.round((180 - impactAngle) % 360)}
                <hr />

                {gameState.gameStatus === 'playing' && (
                    <button onClick={() => pauseGame()}>pause</button>
                )}

                {gameState.gameStatus === 'pause' && (
                    <button onClick={() => unpauseGame()}>play</button>
                )}
            </div>
        );
    }

    return null;
};

