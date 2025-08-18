// webserver.ts

import fs from 'fs';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createWalletClient, createPublicClient, http, custom, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { monadTestnet } from './config/network';

import LEADERBOARD_ABI from './contract/leaderboard.json';


// Configuration initiale
const PORT = 5686;
const CONTRACT_ADDRESS = '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4'; // Leaderboard => https://testnet.monadexplorer.com/address/0xceCBFF203C8B6044F52CE23D914A1bfD997541A4?tab=Contract

//const gameBotAddress = '0xCCF8BA457dCad7eE6A0361c96846a0f79744b113';


// Fonction pour obtenir la clé privée
function getPrivateKey(): `0x${string}` {
    const filePath = '/tmp/devwal-evm.tst';

    if (!fs.existsSync(filePath)) {
        throw new Error(`Wallet not found at ${filePath}`);
    }

    const privateKey = fs.readFileSync(filePath, 'utf-8').trim();
    if (!privateKey.startsWith('0x')) {
        return `0x${privateKey}`;
    }
    return privateKey as `0x${string}`;
}


async function main() {
    const privateKey = getPrivateKey();
    const account = privateKeyToAccount(privateKey);

    // Clients blockchain
    const walletClient = createWalletClient({
        account,
        chain: monadTestnet,
        transport: http()
    });

    const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http()
    });

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    if (process.argv.includes('--dev')) {
        // dev
        //app.use( /* TODO: proxy to http://localhost:5685 */ );

    } else {
        // prod
        app.use(express.static(`${__dirname}/../../frontend/dist/`))
    }


    // Route GET /api/playerDataPerGame
    app.get('/api/playerDataPerGame', async (req: Request, res: Response) => {
        try {
            let { game, player } = req.query;

            game = game || walletClient.account.address;

            if (!game || !player) {
                return res.status(400).json({ error: 'Missing game or player address' });
            }
            const data = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'playerDataPerGame',
                args: [game, player],
            }) as [bigint, bigint]; // [score, transactions]

            console.log('result:', data)

            res.json({
                success: true,
                data: { score: Number(data[0]), transactions: Number(data[1]) },
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Route GET /api/totalScoreOfPlayer
    app.get('/api/totalScoreOfPlayer', async (req: Request, res: Response) => {
        try {
            const { player } = req.query;

            if (!player) {
                return res.status(400).json({ error: 'Missing player address' });
            }

            const score = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'totalScoreOfPlayer',
                args: [player],
            }) as bigint;

            res.json({
                success: true,
                score: Number(score),
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Route GET /api/games
    app.get('/api/games', async (req: Request, res: Response) => {
        try {
            let { game } = req.query;

            game = game || walletClient.account.address;

            if (!game) {
                return res.status(400).json({ error: 'Missing game address' });
            }

            const gameData = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'games',
                args: [game],
            }) as [string, string, string, string]; // [game, image, name, url];

            res.json({
                success: true,
                game: gameData,
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Route POST /api/registerGame
    app.post('/api/registerGame', async (req: Request, res: Response) => {
        try {
            let { game, name, image, url } = req.body;

            game = game || walletClient.account.address;

            if (!game || !name || !image || !url) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            const { request } = await publicClient.simulateContract({
                account,
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'registerGame',
                args: [game, name, image, url],
            });

            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            console.log('registerGame receipt:', receipt)

            res.json({
                success: true,
                transactionHash: hash,
                //receipt,
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Route POST /api/updatePlayerData
    app.post('/api/updatePlayerData', async (req: Request, res: Response) => {
        try {
            const { player, scoreAmount, transactionAmount } = req.body;

            if (!player || scoreAmount === undefined || transactionAmount === undefined) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            const { request } = await publicClient.simulateContract({
                account,
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'updatePlayerData',
                args: [player, scoreAmount, transactionAmount],
            });

            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            console.log('updatePlayerData receipt:', receipt)

            res.json({
                success: true,
                transactionHash: hash,
                //receipt,
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Route POST /api/unregisterGame
    app.post('/api/unregisterGame', async (req: Request, res: Response) => {
        try {
            let { game } = req.body;

            game = game || walletClient.account.address;

            if (!game) {
                return res.status(400).json({ error: 'Missing game address' });
            }

            const { request } = await publicClient.simulateContract({
                account,
                address: CONTRACT_ADDRESS,
                abi: LEADERBOARD_ABI,
                functionName: 'unregisterGame',
                args: [game],
            });

            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            res.json({
                success: true,
                transactionHash: hash,
                receipt,
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Démarrage du serveur
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}


// Lancement de l'application
main().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

