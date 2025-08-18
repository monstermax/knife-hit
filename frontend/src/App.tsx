import React, { FC } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

import { appId, privyConfig } from './privy_config';
import { useGameState } from './hooks/useGameState';

import { LoadingPage } from './pages/loading';
import { HomePage } from './pages/home';
import { GamePage } from './pages/game';
import { GameFullState } from './types/game';

import './App.css';


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
    const gameFullState: GameFullState = useGameState();
    const { gameState } = gameFullState;

    return (
        <>
            {/* Loading Page */}
            {gameState.gameStatus === 'loading' && (
                <LoadingPage gameFullState={gameFullState} />
            )}

            {/* Home Page */}
            {(gameState.gameStatus === 'home') && (
                <HomePage gameFullState={gameFullState} />
            )}

            {/* Game Page */}
            {gameState.gameStatus !== 'home' && gameState.gameStatus !== 'loading' && (
                <GamePage gameFullState={gameFullState} />
            )}
        </>
    );
}


export default App;
