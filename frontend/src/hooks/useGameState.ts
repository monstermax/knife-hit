import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

import { GameState, ThrowingKnife, PlantedKnife, AppleItem, PrivyUser, GameFullState } from '../types/game';
import { generateLevelConfig, generatePreKnives, generateApples, checkKnifeCollision, checkAppleCollision, calculateScore, GAME_CONFIG, getUserAddress, calculateCycleMultiplier } from '../utils/gameUtils';
import { CrossAppAccountWithMetadata, useConnectWallet, usePrivy } from '@privy-io/react-auth';


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

    const { ready, authenticated, user, login, logout } = usePrivy();
    const { connectWallet } = useConnectWallet();

    const [throwingKnives, setThrowingKnives] = useState<ThrowingKnife[]>([]);

    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Refs pour l'animation optimisée
    const animationRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const levelStartTimeRef = useRef<number>(0);

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

    // Animation de rotation avec cycle
    useEffect(() => {
        if (gameState.gameStatus !== 'playing') {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = undefined;
            }
            return;
        }

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }
            if (!levelStartTimeRef.current) {
                levelStartTimeRef.current = timestamp;
            }

            const deltaTime = (timestamp - startTimeRef.current) / 1000;

            setGameState(prev => {
                // Récupérer la config du niveau actuel
                const levelConfig = generateLevelConfig(prev.level);

                // Calculer le multiplicateur cyclique avec continuité
                const { multiplier: cycleMultiplier, cycleInfo } = calculateCycleMultiplier(
                    levelStartTimeRef.current,
                    timestamp,
                    levelConfig.cycle
                );

                // Debug optionnel
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Cycle ${cycleInfo.cycleNumber}, Progress: ${cycleInfo.progress.toFixed(2)}, Multiplier: ${cycleMultiplier.toFixed(2)}`);
                }

                // Appliquer la rotation avec le cycle
                const rotationDelta = prev.rotationSpeed * deltaTime * 50 * cycleMultiplier;

                return {
                    ...prev,
                    targetRotation: (prev.targetRotation + rotationDelta) % 360,
                };
            });

            startTimeRef.current = timestamp;
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = undefined;
            }
            startTimeRef.current = 0;
        };
    }, [gameState.gameStatus, gameState.rotationSpeed, gameState.level]);


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
        startTimeRef.current = 0;
        levelStartTimeRef.current = 0;
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
        startTimeRef.current = 0;
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

        startTimeRef.current = 0;
        levelStartTimeRef.current = 0;
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

    // Animation de lancer de couteau optimisée
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

        setThrowingKnives(prev => [...prev, newKnife]);
        setGameState(prev => ({
            ...prev,
            knivesRemaining: prev.knivesRemaining - 1,
        }));

        // Animation plus fluide avec duration réduite
        const duration = 50; // ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setThrowingKnives(prev =>
                prev.map(knife =>
                    knife.id === newKnife.id ? { ...knife, progress } : knife
                )
            );

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Impact - calcul simplifié de l'angle
                setGameState(prev => {
                    const impactAngle = (180 + 360 - prev.targetRotation) % 360;

                    // Check collision
                    if (checkKnifeCollision(impactAngle, prev.plantedKnives)) {
                        const newState: GameState = { ...prev, gameStatus: 'pause' };

                        setTimeout(() => {
                            setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }))
                        }, 500)

                        if (prev.score > prev.bestScore) newState.bestScore = newState.score;
                        if (prev.level > prev.bestLevel) newState.bestLevel = newState.level;

                        const sound = new Audio('/sounds/hit-armor-03-266300.mp3');
                        sound.play();

                        return newState;
                    }

                    // Check apple collision
                    const impactHitApple = checkAppleCollision(impactAngle, prev.apples);

                    if (impactHitApple) {
                            const sound = new Audio('/sounds/hit-plant-02-266291.mp3');
                            sound.play();
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

                    // Check level complete
                    if (newState.knivesRemaining <= 0) {
                        setTimeout(() => {
                            setGameState(prev => ({ ...prev, gameStatus: 'levelComplete' }))
                        }, 300)

                        return { ...newState, gameStatus: 'pause' };
                    }

                    return newState;
                });
            }
        };

        const sound = new Audio('/sounds/hit-flesh-01-266311.mp3');
        sound.play();

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
