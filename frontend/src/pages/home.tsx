import { FC } from "react";

import { MonadGamesId } from "@/components/MonadGamesId";
import { Button } from '@/components/ui/button'
import { getGame, getPlayerDataPerGame, registerGame, updatePlayerData } from "@/utils/backend_api";

import type { GameFullState } from "@/types/game";


const debug = false;


export const HomePage: FC<{ gameFullState: GameFullState }> = ({ gameFullState }) => {
    const { ready, authenticated, accountAddress, login, startGame } = gameFullState;

    const playAsGuest = () => {
        startGame();
    };

    const connectAndPlay = () => {
        if (authenticated && accountAddress) {
            startGame(accountAddress);

        } else {
            login();
        }
    };


    return (
        <div className="home-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Title */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-white mb-2">
                        🔪 Knife Hit
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Hit the target, collect apples, avoid the knives!
                    </p>

                    {/* Personal Best - Affichage discret */}
                    {(gameFullState.gameState.bestScore > 0 || gameFullState.gameState.bestLevel > 0) && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/20">
                                <span className="text-purple-300 text-sm">🏆 Best:</span>
                                <span className="text-white text-sm font-medium">
                                    Level {gameFullState.gameState.bestLevel}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-white text-sm font-medium">
                                    {gameFullState.gameState.bestScore} pts
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Game buttons */}
                <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center justify-center">
                            <img src="/images/pepe.gif" style={{ height: '150px' }} />
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={playAsGuest}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                            >
                                🎮 Play as Guest
                            </button>

                            {!authenticated && (
                                <>
                                    <button
                                        onClick={connectAndPlay}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                                        disabled={!ready}
                                    >
                                        {!ready ? "Loading..." : "🚀 Connect"}
                                    </button>
                                </>
                            )}

                            {authenticated && (
                                <>
                                    <button
                                        onClick={connectAndPlay}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                                        disabled={!ready || !accountAddress}
                                    >
                                        {(!ready || !accountAddress) ? "Loading..." : "🚀 Play Connected"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Connected status */}
                {authenticated && (
                    <div className="space-y-4">
                        <MonadGamesId gameFullState={gameFullState} />
                    </div>
                )}

                {debug && (
                    <>
                        <hr />
                        <Button onClick={() => getGame().then(console.log)}>getGame</Button>
                        <Button onClick={() => registerGame()}>registerGame</Button>
                        <Button onClick={() => getPlayerDataPerGame(accountAddress ?? '').then(console.log)}>getPlayerDataPerGame</Button>
                        <Button onClick={() => updatePlayerData(accountAddress ?? '', 10)}>updatePlayerData</Button>
                    </>
                )}

            </div>
        </div>
    );
}


