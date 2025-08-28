import React, { useEffect } from 'react';

import { updatePlayerData } from '../utils/backend_api';
import { MemeImage } from '../components/svg/MemeImage';

import type { GameState } from '../types/game';


interface GameOverlayProps {
    gameState: GameState;
    onStartGame: () => void;
    onNextLevel: () => void;
    onContinueGame: () => void;
    onResetGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    onBackHome: () => void;
}


const debug = false;

const continueCost = 10;


export const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    onStartGame,
    onNextLevel,
    onContinueGame,
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
        // DEPRECATED
        return (
            <div className="game-over-overlay select-none">
                <div className="backdrop-blur-md bg-black/40 p-8 rounded-3xl border border-purple-500/20 shadow-2xl max-w-md mx-auto">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl font-bold text-purple-400 drop-shadow-lg">🔪 Knife Hit</h1>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Throw knives at the rotating target.<br />
                            Avoid hitting other knives!<br />
                            Collect JohnRich for bonus points.
                        </p>

                        <button
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={onStartGame}
                        >
                            ▶️ Start Game
                        </button>

                        {gameState.totalApples > 0 && (
                            <div className="bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/30">
                                <div className="text-purple-200 font-medium">
                                    <MemeImage memeType={`john`} size={24} /> Bonus collected: {gameState.totalApples}
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
                        <div className="text-6xl mb-3">
                            <img src="/images/molandak_sad_trans.png" className='m-auto' style={{ height:"90px" }} />
                        </div>
                        <h2 className="text-4xl font-bold text-red-300 drop-shadow-lg">Game Over!</h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            disabled={gameState.level <= 1 || gameState.totalApples < continueCost}
                            onClick={onContinueGame}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm cursor-pointer"
                        >
                            Restart Level
                            <br />
                            <small>(Cost <MemeImage memeType='john' size={20} className='inline-block' /> x10)</small>
                        </button>

                        <button
                            onClick={onResetGame}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl mt-4 border border-white/10">
                        <div className="grid grid-cols-5 gap-3 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{gameState.level}</div>
                                <div className="text-xs text-gray-300">Level</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-400">{gameState.score}</div>
                                <div className="text-xs text-gray-300">Score</div>
                            </div>
                            <div></div>
                            <div>
                                <div className="text-lg font-bold text-purple-300">{gameState.bestLevel}</div>
                                <div className="text-xs text-purple-300">Best Lv</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-purple-300">{gameState.bestScore}</div>
                                <div className="text-xs text-purple-300">Best</div>
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
                    <div className="backdrop-blur-md bg-gradient-to-br from-purple-800/80 to-indigo-700/60 p-8 rounded-3xl border-2 border-purple-400/60 shadow-2xl shadow-purple-500/25 animate-pulse max-w-md mx-auto">

                        {/* Icon */}
                        <div className="text-center text-8xl mb-4">
                            <img src="/images/pepe.gif" style={{ height: '150px', margin: 'auto' }} />
                        </div>

                        {/* Title */}
                        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
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
                                <span className="text-purple-400">•</span>
                                <span className="font-bold text-purple-300">{gameState.score} pts</span>
                                {gameState.totalApples > 0 && (
                                    <>
                                        <span className="text-purple-400">•</span>
                                        <span className="text-indigo-400">{gameState.totalApples} <MemeImage memeType={`john`} size={24} /></span>
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
