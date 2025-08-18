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
            <div className="game-over-overlay select-none">
                <div className="bg-black/80 backdrop-blur-sm p-6 rounded-2xl border border-red-400/30 shadow-2xl max-w-lg mx-auto">
                    {/* Game Over Title - Compact */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <span className="text-4xl">💀</span>
                            <h2 className="text-3xl font-bold text-red-400">Game Over!</h2>
                        </div>
                    </div>

                    {/* Stats en une seule ligne */}
                    <div className="bg-gray-800/30 p-4 rounded-xl mb-4">
                        <div className="grid grid-cols-5 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{gameState.level}</div>
                                <div className="text-xs text-gray-300">Level</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{gameState.score}</div>
                                <div className="text-xs text-gray-300">Score</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-green-400">{gameState.totalApples} 🍎</div>
                                <div className="text-xs text-gray-400">Apples</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-purple-300">{gameState.bestLevel}</div>
                                <div className="text-xs text-purple-300">Best Lv</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-purple-300">{gameState.bestScore}</div>
                                <div className="text-xs text-purple-300">Best Sc</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onResetGame}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            🔄 Try Again
                        </button>

                        <button
                            onClick={onBackHome}
                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            🏠 Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'levelComplete') {
        return (
            <div className="level-complete-overlay select-none">
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

