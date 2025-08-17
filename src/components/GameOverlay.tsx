import React, { useEffect } from 'react';
import {useCrossAppAccounts} from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';

import scoreContractAbi from '../utils/score_contract_abi.json';

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


const debug = true;
const scoreContractAddress = '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4';


export const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    onStartGame,
    onNextLevel,
    onResetGame,
    pauseGame,
    unpauseGame,
    onBackHome,
}) => {
    const { sendTransaction } = useCrossAppAccounts();


    const onSubmitScore = async () => {
        if (!gameState.user) return;
        console.log('submit score for user:', gameState.user);

        const crossAppAccount = gameState.user.linkedAccounts.find((account) => account.type === 'cross_app');
        const address = crossAppAccount?.embeddedWallets[0].address;

        if (!address) {
            console.warn(`no cross-app wallet found`);
            return;
        }

        try {
            // Encoder les données pour l'appel au smart contract
            const transactionAmount = 1; // TODO

            const data = encodeFunctionData({
                abi: scoreContractAbi,
                functionName: 'updatePlayerData',
                args: [
                    address, // player address
                    BigInt(gameState.bestScore), // scoreAmount
                    BigInt(transactionAmount) // transactionAmount
                ]
            });

            console.log('Calling smart contract with:', {
                player: address,
                scoreAmount: gameState.bestScore,
                transactionAmount: transactionAmount,
                encodedData: data
            });

            const hash = await sendTransaction(
                {
                    to: scoreContractAddress,
                    value: 0, // Pas de MON envoyé avec la transaction
                    chainId: 10143, // Monad testnet
                    data,
                },
                { address }
            );

            console.log('Transaction hash:', hash);
            console.log('Score submitted successfully!');

            // Optionnel : afficher un message de succès à l'utilisateur
            alert(`Score submitted successfully! Transaction: ${hash}`);

        } catch (error) {
            console.error('Error submitting score:', error);
            // Optionnel : afficher l'erreur à l'utilisateur
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to submit score: ${errorMessage}`);
        }
    }

    useEffect(() => {
        if (gameState.gameStatus === 'levelComplete') {
            const timer = setTimeout(onNextLevel, 300);
            return () => clearTimeout(timer);
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
                <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over!</h2>
                <p className="text-lg mb-2">Level: {gameState.level}</p>
                <p className="text-lg mb-2">Score: {gameState.score}</p>
                <p className="text-lg mb-8">Total Apples: {gameState.totalApples}</p>
                <p className="text-lg mb-2">BestLevel: {gameState.bestLevel}</p>
                <p className="text-lg mb-2">BestScore: {gameState.bestScore}</p>
                <div className="flex gap-4">

                    {gameState.user && (
                        <button
                            onClick={onSubmitScore}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Submit score
                        </button>
                    )}

                    <button
                        onClick={onResetGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={onBackHome}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        );
    }

    if (gameState.gameStatus === 'levelComplete') {

        return (
            <div className="level-complete-overlay">
                <h2 className="text-3xl font-bold mb-4 text-green-400">
                    {gameState.isBossLevel ? 'Boss Defeated!' : 'Level Complete!'}
                </h2>
                <p className="text-lg mb-2">Level: {gameState.level}</p>
                <p className="text-lg mb-2">Score: {gameState.score}</p>
                <p className="text-lg mb-8">Total Apples: {gameState.totalApples}</p>

                {/*
                <button
                    onClick={onNextLevel}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
                >
                    Next Level
                </button>
                */}
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

