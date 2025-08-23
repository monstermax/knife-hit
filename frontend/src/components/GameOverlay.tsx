import React, { useEffect } from 'react';

import { updatePlayerData } from '@/utils/backend_api';
import { getUserAddress } from '@/utils/gameUtils';

import type { GameState } from '../types/game';


interface GameOverlayProps {
    gameState: GameState;
    onStartGame: () => void;
    onNextLevel: () => void;
    onResetGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    onBackHome: () => void;
}


const debug = false;


export const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    onStartGame,
    onNextLevel,
    onResetGame,
    pauseGame,
    unpauseGame,
    onBackHome,
}) => {

    useEffect(() => {
        if (gameState.gameStatus === 'levelComplete') {
            // go to next level
            const timer = setTimeout(onNextLevel, 1000);
            return () => clearTimeout(timer);
        }

        if (gameState.gameStatus === 'gameOver') {
            // submit score
            console.log('gameover. playerAddress =', gameState.playerAddress)

            if (gameState.playerAddress) {
                updatePlayerData(gameState.playerAddress, gameState.score);
            }
        }
    }, [gameState.gameStatus]);


    if (gameState.gameStatus === 'home') {
        return (
            <div className="game-over-overlay">
                <div className="backdrop-blur-md bg-black/40 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md mx-auto">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl font-bold text-white drop-shadow-lg">🔪 Knife Hit</h1>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Throw knives at the rotating target.<br />
                            Avoid hitting other knives!<br />
                            Collect apples for bonus points.
                        </p>

                        <button
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={onStartGame}
                        >
                            ▶️ Start Game
                        </button>

                        {gameState.totalApples > 0 && (
                            <div className="bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/30">
                                <div className="text-amber-200 font-medium">
                                    🍎 Apples collected: {gameState.totalApples}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'gameOver') {
        return (
            <div className="game-over-overlay select-none">
                <div className="backdrop-blur-md bg-gradient-to-br from-red-900/80 to-red-800/60 p-8 rounded-3xl border border-red-400/40 shadow-2xl max-w-lg mx-auto">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-3">💀</div>
                        <h2 className="text-4xl font-bold text-red-300 drop-shadow-lg">Game Over!</h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onBackHome}
                            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg text-base cursor-pointer"
                        >
                            🏠 Back to Home
                        </button>

                        <button
                            onClick={onResetGame}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg cursor-pointer"
                        >
                            🔄 Try Again
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl mt-6 border border-white/10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{gameState.level}</div>
                                <div className="text-sm text-gray-300">Level Reached</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400 mb-1">{gameState.score}</div>
                                <div className="text-sm text-gray-300">Final Score</div>
                            </div>
                        </div>

                        {/* Secondary stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-400">{gameState.totalApples} 🍎</div>
                                <div className="text-xs text-gray-400">Apples</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-purple-300">{gameState.bestLevel}</div>
                                <div className="text-xs text-purple-300">Best Lv</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-purple-300">{gameState.bestScore}</div>
                                <div className="text-xs text-purple-300">Best Score</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'levelComplete') {
        return (
            <div className="level-complete-overlay select-none">
                <div className="flex flex-col items-center justify-center">
                    <div className="backdrop-blur-md bg-gradient-to-br from-green-800/80 to-emerald-700/60 p-8 rounded-3xl border-2 border-green-400/60 shadow-2xl shadow-green-500/25 animate-pulse max-w-md mx-auto">

                        {/* Icon */}
                        <div className="text-center text-8xl mb-4">
                            {gameState.isBossLevel ? '👑' : '✨'}
                        </div>

                        {/* Title */}
                        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent drop-shadow-2xl">
                            {gameState.isBossLevel ? 'BOSS' : 'LEVEL'}
                        </h2>

                        {/* Subtitle */}
                        <div className="text-2xl font-semibold text-white text-center mb-6">
                            {gameState.isBossLevel ? 'DEFEATED!' : 'COMPLETE!'}
                        </div>

                        {/* Stats */}
                        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl">
                            <div className="flex items-center justify-center gap-6 text-lg text-gray-200">
                                <span className="font-bold text-white">LV {gameState.level}</span>
                                <span className="text-green-400">•</span>
                                <span className="font-bold text-yellow-300">{gameState.score} pts</span>
                                {gameState.totalApples > 0 && (
                                    <>
                                        <span className="text-green-400">•</span>
                                        <span className="text-amber-400">{gameState.totalApples} 🍎</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (debug && (gameState.gameStatus === 'playing' || gameState.gameStatus === 'pause')) {
        // DEBUG
        const currentTargetRotation = 360 - gameState.targetRotation;
        const impactAngle = (180 + gameState.targetRotation) % 360;

        return (
            <div style={{
                position: 'absolute',
                top: '100px',
                left: '100px',
                backgroundColor: 'white',
            }}>
                target angle: {Math.round(currentTargetRotation)}
                <hr />
                impact angle: {Math.round(impactAngle)}
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
