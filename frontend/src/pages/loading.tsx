import { FC, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';

import type { GameFullState } from "@/types/game";


export const LoadingPage: FC<{ gameFullState: GameFullState }> = ({ gameFullState }) => {
    const { ready, gameState, quitGame } = gameFullState;

    // Transition from loading to home when Privy is ready
    useEffect(() => {
        if (ready && gameState.gameStatus === 'loading') {
            quitGame(); // This will set gameStatus to 'home'
        }
    }, [ready, gameState.gameStatus, quitGame]);

    return (
        <div className="loading-container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-8 animate-pulse">
                    Loading...
                </h1>
            </div>
        </div>
    );
}

