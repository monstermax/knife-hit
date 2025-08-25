import { FC, useState, useEffect, useRef } from "react";

import { MonadGamesId } from "@/components/MonadGamesId";
import { Button } from '@/components/ui/button'
import { getGame, getPlayerDataPerGame, registerGame, updatePlayerData } from "@/utils/backend_api";

import type { GameFullState } from "@/types/game";


const debug = false;


export const HomePage: FC<{ gameFullState: GameFullState }> = ({ gameFullState }) => {
    const { ready, authenticated, accountAddress, login, startGame } = gameFullState;

    // État pour la position et direction de la mouche
    const [flyPosition, setFlyPosition] = useState({ x: 100, y: 100 });
    const [shouldFlip, setShouldFlip] = useState(false);
    const [flyDuration, setFlyDuration] = useState<number>(3000);
    const previousPosition = useRef({ x: 100, y: 100 });

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


    const moveFly = () => {
        // Génère des positions aléatoirement dans une zone réduite pour éviter les boutons
        const newX = Math.random() * (window.innerWidth - 200) + 50; // Évite les bords
        const newY = Math.random() * (window.innerHeight - 300) + 50; // Évite le bas où sont les boutons

        // Calcule la vitesse horizontale basée sur la position précédente
        const horizontalVelocity = newX - previousPosition.current.x;
        // Applique le miroir seulement si la vitesse horizontale est > 0
        setShouldFlip(horizontalVelocity > 0);

        //console.log('horizontalVelocity:', horizontalVelocity, '=> From', { x: Math.round(previousPosition.current.x), y: Math.round(previousPosition.current.y) }, '=> Go to ', { x: Math.round(newX), y: Math.round(newY) })

        // Met à jour la position précédente
        previousPosition.current = { x: newX, y: newY };
        setFlyPosition({ x: newX, y: newY });
    }



    // Animation de la mouche
    useEffect(() => {
        let timer: null | NodeJS.Timeout = null;

        const moveFlyLoop = () => {
            moveFly();

            timer = setTimeout(moveFlyLoop, 3000 + Math.random() * 3000);
        }

        moveFlyLoop();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);


    return (
        <div className="home-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-800 to-indigo-900 flex items-center justify-center p-8 relative">
            {/* Mouche volante */}
            <img
                src="/images/mouch.png"
                alt="mouche"
                className={`absolute pointer-events-none transition-all duration-[${flyDuration}ms] ease-in-out z-10`}
                style={{
                    height: '50px',
                    left: `${flyPosition.x}px`,
                    top: `${flyPosition.y}px`,
                    transform: `translate(-50%, -50%) ${shouldFlip ? 'scaleX(-1)' : 'scaleX(1)'}`
                }}
            />
            <div className="max-w-md w-full text-center space-y-8">
                {/* Title */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-purple-400 mb-2">
                        🔪 Knife Hit
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Hit the target, collect apples, avoid the knives!
                    </p>

                    {/* Personal Best - Affichage discret */}
                    {(gameFullState.gameState.bestScore > 0 || gameFullState.gameState.bestLevel > 0) && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/30">
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
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                            >
                                🎮 Play as Guest
                            </button>

                            {!authenticated && (
                                <>
                                    <button
                                        onClick={connectAndPlay}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
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
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
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


