
import fs from 'fs';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { monadTestnet } from '../config/network';

import LEADERBOARD_ABI from '../contract/leaderboard.json';


type LeaderboardResult = {
    data: LeaderboardEntry[]
    pagination: {
        page: number
        limit: number
        total: string
        totalPages: number
    }
    sortBy: string
    sortOrder: string
    gameId: number | null
};

type LeaderboardEntry = {
    userId: number
    username: string
    walletAddress: string
    score?: number
    transactionCount?: number
    gameId: number | null
    gameName: string
    rank: number
}

type PlayerStat = {
  userId: number
  username: string
  walletAddress: string
  transactionCount: number
  gameId: number
  gameName: string
  rank: number
  score: number
};


const gameId = 104; // old = 44


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


dotenv.config({ path: `${__dirname}/../../.env` });

const privateKey = (process.env.PRIVATE_KEY || getPrivateKey()) as `0x${string}`;

if (!privateKey) {
    console.warn(`Error: private key not found`);
    process.exit(1);
}

const CONTRACT_ADDRESS = '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4'; // Leaderboard => https://testnet.monadexplorer.com/address/0xceCBFF203C8B6044F52CE23D914A1bfD997541A4?tab=Contract

const usedTokens: number[] = [];


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


console.log(`Using wallet ${walletClient.account.address}`)



async function tmpFixLeaderboard() {
    const playersStat: PlayerStat[] = (await import(`${__dirname}/../tmp_old_leaderboard.json`)).default;

    for (const playerStat of playersStat) {
        const { walletAddress, score, transactionCount } = playerStat;

        const { request } = await publicClient.simulateContract({
            account,
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: 'updatePlayerData',
            args: [walletAddress, score, transactionCount],
        });

        console.log('request:', request)

        const hash = await walletClient.writeContract(request);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

    }
}



//tmpFixLeaderboard();


// API ROUTES

export const apiRouter = express.Router();


// Route GET /api/playerDataPerGame
apiRouter.get('/playerDataPerGame', async (req: Request, res: Response) => {
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

        //console.log('result:', data)

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
apiRouter.get('/totalScoreOfPlayer', async (req: Request, res: Response) => {
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
apiRouter.get('/games', async (req: Request, res: Response) => {
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

// Route GET /api/leaderboard
apiRouter.get('/leaderboard', async (req: Request, res: Response) => {
    try {
        let sortBy = "scores";
        let page = 1;

        let leaderboard;

        {
            const url = `https://monad-games-id-site.vercel.app/api/leaderboard?page=${page}&gameId=${gameId}`;
            const response = await fetch(url);
            leaderboard = await response.json() as LeaderboardResult;
        }

        {
            const url = `https://monad-games-id-site.vercel.app/api/leaderboard?page=${page}&gameId=${gameId}&sortBy=scores`;
            const response = await fetch(url);
            const leaderboardScores = await response.json() as LeaderboardResult;

            const leaderboardScoresMap = Object.fromEntries(
                leaderboardScores.data.map(entry => [entry.userId, entry])
            );

            for (const entry of leaderboard.data) {
                const userId = entry.userId;
                entry.score = leaderboardScoresMap[userId]?.score ?? 0;
            }
        }


        res.json({
            success: true,
            leaderboard,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route POST /api/registerGame
apiRouter.post('/registerGame', async (req: Request, res: Response) => {
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

        //console.log('registerGame receipt:', receipt)

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
apiRouter.post('/updatePlayerData', async (req: Request, res: Response) => {
    try {
        const { player, scoreAmount, transactionAmount, r } = req.body;

        if (!player || scoreAmount === undefined || transactionAmount === undefined) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if (!Number(r)) {
            return res.status(400).json({ error: 'Missing required token' });
        }

        if (Number(r) / Number(scoreAmount) !== Math.round(Number(r) / Number(scoreAmount))) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        if (usedTokens.includes(Number(r))) {
            return res.status(400).json({ error: 'Used token' });
        }

        usedTokens.push(Number(r));

        const { request } = await publicClient.simulateContract({
            account,
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: 'updatePlayerData',
            args: [player, scoreAmount, transactionAmount],
        });

        const hash = await walletClient.writeContract(request);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        //console.log('updatePlayerData receipt:', receipt)

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
apiRouter.post('/unregisterGame', async (req: Request, res: Response) => {
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

