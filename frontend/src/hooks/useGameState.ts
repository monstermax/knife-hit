import { useState, useCallback, useEffect, useMemo } from 'react';

import { GameState, ThrowingKnife, PlantedKnife, AppleItem, PrivyUser, GameFullState } from '../types/game';
import { generateLevelConfig, generatePreKnives, generateApples, checkKnifeCollision, checkAppleCollision, calculateScore, GAME_CONFIG, getUserAddress } from '../utils/gameUtils';
import { CrossAppAccountWithMetadata, useConnectWallet, usePrivy } from '@privy-io/react-auth';


const fps = 40;


export const useGameState = (): GameFullState => {

    const [gameState, setGameState] = useState<GameState>(() => {
        // Initialise gameState
        const savedApples = localStorage.getItem('knife-hit-apples');
        const totalApples = savedApples ? parseInt(savedApples, 10) : 0;

        const savedBestScore = localStorage.getItem('knife-hit-bestscore');
        const bestScore = savedBestScore ? parseInt(savedBestScore, 10) : 0;

        const savedBestLevel = localStorage.getItem('knife-hit-bestlevel');
        const bestLevel = savedBestLevel ? parseInt(savedBestLevel, 10) : 0;

        return {
            playerAddress: null,
            level: 1,
            score: 0,
            totalApples,
            knivesRemaining: 6,
            plantedKnives: [],
            apples: [],
            targetRotation: 0,
            rotationSpeed: 0,
            gameStatus: 'loading',
            targetType: 'wood',
            isBossLevel: false,
            bestScore,
            bestLevel,
        };
    });

    const {ready, authenticated, user, login, logout } = usePrivy();
    const { connectWallet } = useConnectWallet();

    const [throwingKnives, setThrowingKnives] = useState<ThrowingKnife[]>([]);

    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //const accountAddress = useMemo(() => getUserAddress(user), [user]);

    // Save apples/bestscore/bestlevel to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('knife-hit-apples', gameState.totalApples.toString());
    }, [gameState.totalApples]);

    useEffect(() => {
        localStorage.setItem('knife-hit-bestscore', gameState.bestScore.toString());
    }, [gameState.bestScore]);

    useEffect(() => {
        localStorage.setItem('knife-hit-bestlevel', gameState.bestLevel.toString());
    }, [gameState.bestLevel]);


    // Target rotation animation
    useEffect(() => {
        if (gameState.gameStatus !== 'playing') return;

        const interval = setInterval(() => {
            setGameState(prev => ({
                ...prev,
                targetRotation: (prev.targetRotation + prev.rotationSpeed * 3) % 360,
            }));
        }, 1000/fps);

        return () => clearInterval(interval);
    }, [gameState.gameStatus, gameState.rotationSpeed]);


    useEffect(() => {
        setAccountAddress(null);
        setUsername(null);
        setError(null);

        if (authenticated && user && ready && user.linkedAccounts.length > 0) {
            const crossAppAccount = user.linkedAccounts.find(
                account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
            ) as CrossAppAccountWithMetadata;

            if (crossAppAccount?.embeddedWallets.length > 0) {
                const walletAddress = crossAppAccount.embeddedWallets[0].address;
                setAccountAddress(walletAddress);
                fetchUsername(walletAddress);

            } else {
                setError("Monad Games ID account not found");
            }

        } else if (authenticated && user && ready) {
            setError("Please link your Monad Games ID account");
        }

    }, [authenticated, user, ready]);


    const fetchUsername = async (walletAddress: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.hasUsername ? data.user.username : "");
            }

        } catch (err) {
            console.error("Error fetching username:", err);
            setError("Failed to load username");

        } finally {
            setLoading(false);
        }
    };

    const handleCreateWallet = async () => {
        try {
            // Utiliser connectWallet sans paramètres pour créer un wallet intégré
            await connectWallet();

        } catch (err) {
            console.error("Error creating wallet:", err);
            setError("Failed to create wallet");
        }
    };


    const startGame = (playerAddress?: string | null) => {
        playerAddress = playerAddress ?? null;
        const levelConfig = generateLevelConfig(1);
        const preKnives = generatePreKnives(levelConfig.preKnives);
        const apples = generateApples(levelConfig.appleCount, preKnives);

        console.log('startGame with user', user)
        console.log('startGame with playerAddress', playerAddress)

        setGameState(prev => ({
            ...prev,
            level: 1,
            score: 0,
            knivesRemaining: levelConfig.knivesToThrow,
            plantedKnives: preKnives,
            apples,
            targetRotation: 0,
            rotationSpeed: levelConfig.rotationSpeed,
            gameStatus: 'playing',
            targetType: levelConfig.targetType,
            isBossLevel: levelConfig.isBoss,
            playerAddress,
        }));

        setThrowingKnives([]);
    };


    const pauseGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'pause',
        }));
    }, []);


    const unpauseGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'playing',
        }));
    }, []);


    const nextLevel = useCallback(() => {
        const nextLevelNum = gameState.level + 1;
        const levelConfig = generateLevelConfig(nextLevelNum);
        const preKnives = generatePreKnives(levelConfig.preKnives);
        const apples = generateApples(levelConfig.appleCount, preKnives);

        setGameState(prev => ({
            ...prev,
            level: nextLevelNum,
            knivesRemaining: levelConfig.knivesToThrow,
            plantedKnives: preKnives,
            apples,
            targetRotation: 0,
            rotationSpeed: levelConfig.rotationSpeed,
            gameStatus: 'playing',
            targetType: levelConfig.targetType,
            isBossLevel: levelConfig.isBoss,
        }));
    }, [gameState.level]);


    const quitGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            level: 0,
            score: 0,
            gameStatus: 'home',
            playerAddress: null,
        }));
        setThrowingKnives([]);
    }, []);


    const resetGame = () => {
        console.log('resetGame with accountAddress', gameState.playerAddress)
        startGame(gameState.playerAddress)
    };


    const throwKnife = useCallback(() => {
        if (gameState.knivesRemaining <= 0 || gameState.gameStatus !== 'playing') {
            return;
        }

        const newKnife: ThrowingKnife = {
            id: `knife-${Date.now()}`,
            position: {
                x: GAME_CONFIG.TARGET_CENTER_X,
                y: GAME_CONFIG.CANVAS_HEIGHT - 100,
            },
            progress: 0,
            isThrown: true,
        };

        // Add knife to throwing knives list
        setThrowingKnives(prev => [...prev, newKnife]);

        // Immediately decrease knives remaining
        setGameState(prev => ({
            ...prev,
            knivesRemaining: prev.knivesRemaining - 1,
        }));

        // Animate knife throw
        const duration = 50; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setThrowingKnives(prev =>
                prev.map(knife =>
                    knife.id === newKnife.id ? { ...knife, progress } : knife
                )
            );

            if (progress < 1) {
                requestAnimationFrame(animate);

            } else {
                // Knife has reached target
                // Calculate everything at the exact moment of impact

                setGameState(prev => {
                    const currentTargetRotation = 360 - prev.targetRotation;
                    // Calculate the impact angle relative to the current target rotation
                    //const impactAngle = (360 - currentTargetRotation) % 360; // OK ?
                    const impactAngle = (180 + currentTargetRotation) % 360;
                    //const impactAngle = (360 + currentTargetRotation) % 360;

                    // Check collision with existing knives at impact moment
                    if (checkKnifeCollision(impactAngle, prev.plantedKnives)) {
                        const newState: GameState = { ...prev, gameStatus: 'pause' };

                        setTimeout(() => {
                            setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }))
                        }, 500)

                        // TODO: animation couteau qui rebondit

                        if (prev.score > prev.bestScore) newState.bestScore = newState.score;
                        if (prev.level > prev.bestLevel) newState.bestLevel = newState.level;

                        return newState;
                    }

                    // Check apple collision at impact moment
                    const impactHitApple = checkAppleCollision(impactAngle, prev.apples);

                    if (impactHitApple) {
                        // TODO: animation pomme qui explose en 2

                    } else {
                        // TODO: animation particules
                    }

                    setThrowingKnives(prev => prev.filter(knife => knife.id !== newKnife.id));


                    const newPlantedKnife: PlantedKnife = {
                        id: newKnife.id,
                        angle: impactAngle,
                    };

                    const newState: GameState = {
                        ...prev,
                        plantedKnives: [...prev.plantedKnives, newPlantedKnife],
                        score: prev.score + calculateScore(prev.level, impactHitApple ? 1 : 0),
                        totalApples: impactHitApple ? prev.totalApples + 1 : prev.totalApples,
                        apples: impactHitApple
                            ? prev.apples.map(apple =>
                                apple.id === impactHitApple.id ? { ...apple, collected: true } : apple
                            )
                            : prev.apples,
                    };

                    //console.log(`currentAngle:`, gameState.targetRotation)
                    //console.log(`impactAngle:`, impactAngle)
                    //console.log(`newPlantedKnife:`, newPlantedKnife)

                    // Check if level is complete
                    if (newState.knivesRemaining <= 0) {

                        // TODO animation cible qui explose

                        setTimeout(() => {
                            setGameState(prev => ({ ...prev, gameStatus: 'levelComplete' }))
                        }, 300)

                        return { ...newState, gameStatus: 'pause' };
                    }

                    return newState;
                });

                // Remove knife from throwing knives
                //setThrowingKnives(prev => prev.filter(knife => knife.id !== newKnife.id));

                //pauseGame(); // DEBUG
            }
        };

        requestAnimationFrame(animate);
    }, [gameState.knivesRemaining, gameState.gameStatus, gameState.targetRotation, gameState.plantedKnives, gameState.apples]);


    return {
        authenticated,
        user,
        accountAddress,
        username,
        ready,
        loading,
        error,
        gameState,
        throwingKnives,
        login,
        logout,
        startGame,
        nextLevel,
        throwKnife,
        resetGame,
        pauseGame,
        unpauseGame,
        quitGame,
        setAccountAddress,
        setUsername,
        setLoading,
        setError,
        handleCreateWallet,
    };
};

