import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { GameOverlay } from './components/GameOverlay';
import { useGameState } from './hooks/useGameState';

import './App.css';


function App() {
    const { gameState, throwingKnives, startGame, nextLevel, resetGame, throwKnife, pauseGame, unpauseGame } = useGameState();

    return (
        <PrivyProvider
            appId="cmeeuf2td01bjl70ckbe3yevz"
            config={{
                "appearance": {
                    "accentColor": "#6A6FF5",
                    "theme": "#ffffff",
                    "showWalletLoginFirst": true,
                    "logo": "https://auth.privy.io/logos/privy-logo.png",
                    "walletChainType": "ethereum-only",
                    "walletList": [
                        "detected_ethereum_wallets",
                        "metamask",
                        "coinbase_wallet",
                        "base_account",
                        "rainbow",
                        "wallet_connect"
                    ]
                },
                "loginMethods": [
                    "wallet",
                    "email",
                    "google",
                    "twitter",
                    "github",
                    "apple",
                    "discord"
                ],
                "fundingMethodConfig": {
                    "moonpay": {
                        "useSandbox": true
                    }
                },
                "embeddedWallets": {
                    "requireUserPasswordOnCreate": false,
                    "showWalletUIs": true,
                    "ethereum": {
                        "createOnLogin": "users-without-wallets"
                    },
                    "solana": {
                        "createOnLogin": "off"
                    }
                },
                "mfa": {
                    "noPromptOnMfaRequired": false
                },
                "externalWallets": {
                }
            }}
        >


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

        </PrivyProvider>
    );
}


export default App;

