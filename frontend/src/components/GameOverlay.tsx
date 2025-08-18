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
                <div className="bg-black/80 backdrop-blur-sm p-8 rounded-2xl border border-red-400/30 shadow-2xl max-w-md mx-auto">
                    {/* Game Over Title with animation effect */}
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-2">💀</div>
                        <h2 className="text-4xl font-bold text-red-400 mb-2 drop-shadow-lg">Game Over!</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full"></div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-4 mb-8">
                        {/* Current Game Stats */}
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/30">
                            <h3 className="text-yellow-400 font-semibold mb-3 text-center">🎯 Final Score</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-white">{gameState.level}</div>
                                    <div className="text-sm text-gray-300">Level</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{gameState.score}</div>
                                    <div className="text-sm text-gray-300">Score</div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <div className="text-lg font-semibold text-green-400">{gameState.totalApples} 🍎</div>
                                <div className="text-xs text-gray-400">Apples Collected</div>
                            </div>
                        </div>

                        {/* Best Records */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-xl border border-purple-500/30">
                            <h3 className="text-purple-300 font-semibold mb-3 text-center">🏆 Personal Best</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-xl font-bold text-purple-200">{gameState.bestLevel}</div>
                                    <div className="text-xs text-purple-300">Best Level</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-purple-200">{gameState.bestScore}</div>
                                    <div className="text-xs text-purple-300">Best Score</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onResetGame}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg shadow-blue-500/25"
                        >
                            <span className="text-lg">🔄</span> Try Again
                        </button>

                        <button
                            onClick={onBackHome}
                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg"
                        >
                            <span className="text-lg">🏠</span> Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'levelComplete') {
        return (
            <div className="level-complete-overlay">
                <div className="flex flex-col items-center justify-center">
                    {/* Container avec fond et bordure */}
                    <div className="bg-black/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-400/50 shadow-2xl shadow-green-500/25 animate-pulse">
                        {/* Icône dynamique selon le type de niveau */}
                        <div className="text-center text-8xl mb-4">
                            {gameState.isBossLevel ? '👑' : '✨'}
                        </div>

                        {/* Titre principal - Grande taille pour impact visuel */}
                        <h2 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-2xl">
                            {gameState.isBossLevel ? 'BOSS' : 'LEVEL'}
                        </h2>

                        {/* Sous-titre épuré */}
                        <div className="text-2xl font-semibold text-white text-center mb-6">
                            {gameState.isBossLevel ? 'DEFEATED!' : 'COMPLETE!'}
                        </div>

                        {/* Informations essentielles en une ligne */}
                        <div className="flex items-center justify-center gap-6 text-lg text-gray-200">
                            <span className="font-bold">LV {gameState.level}</span>
                            <span className="text-green-400">•</span>
                            <span className="font-bold">{gameState.score} pts</span>
                            {gameState.totalApples > 0 && (
                                <>
                                    <span className="text-green-400">•</span>
                                    <span className="text-yellow-400">{gameState.totalApples} 🍎</span>
                                </>
                            )}
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

