import React, { FC, useEffect } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';

import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { GameOverlay } from './components/GameOverlay';
import { useGameState } from './hooks/useGameState';

import './App.css';
import { appId, privyConfig } from './privy_config';
import MonadGamesId from './components/MonadGamesId';


export const AppWithProviders: FC = () => {
    return (
        <PrivyProvider
            appId={appId}
            config={privyConfig}
        >
            <App />
        </PrivyProvider>
    );
}


const App: FC = () => {
    const { gameState, throwingKnives, startGame, nextLevel, resetGame, throwKnife, pauseGame, unpauseGame } = useGameState();

    const {ready, authenticated, user, login, logout } = usePrivy();
    const {wallets} = useWallets();

    useEffect(() => {
        console.log('user:', user)
    }, [user])

    useEffect(() => {
        console.log('wallets:', wallets)
    }, [wallets])


    return (
        <>
            {/* Loading Page */}
            {gameState.gameStatus === 'loading' && (
                <div className="home-container">
                    Homepage

                    <hr />

                    <div className="mt-8 space-y-6">
                        {!authenticated ? (
                            <div className="text-center space-y-4">
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-300 mb-4">
                                        🎮 Connect your wallet to access Monad Games ID and save your progress!
                                    </p>
                                    <button
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
                                        onClick={() => login()}
                                        disabled={!ready}
                                    >
                                        {!ready ? "Loading..." : "🚀 Connect Wallet"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg mb-4">
                                        ✅ Wallet Connected
                                    </div>
                                </div>
                                <MonadGamesId />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Home Page */}
            {gameState.gameStatus === 'home' && (
                <div className="home-container">
                    Homepage

                    <hr />

                    <div className="mt-8 space-y-6">
                        {!authenticated ? (
                            <div className="text-center space-y-4">
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-300 mb-4">
                                        🎮 Connect your wallet to access Monad Games ID and save your progress!
                                    </p>
                                    <button
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
                                        onClick={() => login()}
                                        disabled={!ready}
                                    >
                                        {!ready ? "Loading..." : "🚀 Connect Wallet"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg mb-4">
                                        ✅ Wallet Connected
                                    </div>
                                </div>
                                <MonadGamesId />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Game Page */}
            {gameState.gameStatus === 'playing' && (
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
            )}
        </>
    );
}


export default App;

