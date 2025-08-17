import { useState, useCallback, useEffect } from 'react';

import { GameState, ThrowingKnife, PlantedKnife, AppleItem } from '../types/game';
import { generateLevelConfig, generatePreKnives, generateApples, checkKnifeCollision, checkAppleCollision, calculateScore, GAME_CONFIG } from '../utils/gameUtils';


const STORAGE_KEY = 'knife-hit-apples';


export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const savedApples = localStorage.getItem(STORAGE_KEY);
        const totalApples = savedApples ? parseInt(savedApples, 10) : 0;

        return {
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
        };
    });

    const [throwingKnives, setThrowingKnives] = useState<ThrowingKnife[]>([]);

    // Save apples to localStorage whenever totalApples changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, gameState.totalApples.toString());
    }, [gameState.totalApples]);

    // Target rotation animation
    useEffect(() => {
        if (gameState.gameStatus !== 'playing') return;

        const interval = setInterval(() => {
            setGameState(prev => ({
                ...prev,
                targetRotation: (prev.targetRotation + prev.rotationSpeed) % 360,
            }));
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [gameState.gameStatus, gameState.rotationSpeed]);

    const startGame = useCallback(() => {
        const levelConfig = generateLevelConfig(1);
        const preKnives = generatePreKnives(levelConfig.preKnives);
        const apples = generateApples(levelConfig.appleCount, preKnives);

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
        }));
    }, []);

    const pauseGame = useCallback(() => {
        const levelConfig = generateLevelConfig(1);
        const preKnives = generatePreKnives(levelConfig.preKnives);
        const apples = generateApples(levelConfig.appleCount, preKnives);

        setGameState(prev => ({
            ...prev,
            //targetRotation: 0,
            //rotationSpeed: levelConfig.rotationSpeed,
            gameStatus: 'pause',
        }));
    }, []);

    const unpauseGame = useCallback(() => {
        const levelConfig = generateLevelConfig(1);
        const preKnives = generatePreKnives(levelConfig.preKnives);
        const apples = generateApples(levelConfig.appleCount, preKnives);

        setGameState(prev => ({
            ...prev,
            //targetRotation: 0,
            //rotationSpeed: levelConfig.rotationSpeed,
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

    const throwKnife = useCallback(() => {
        if (gameState.knivesRemaining <= 0 || gameState.gameStatus !== 'playing') {
            return;
        }

        const newKnife: ThrowingKnife = {
            id: `knife-${Date.now()}`,
            position: { x: GAME_CONFIG.TARGET_CENTER_X, y: GAME_CONFIG.CANVAS_HEIGHT - 100 },
            targetPosition: {
                x: GAME_CONFIG.TARGET_CENTER_X,
                y: GAME_CONFIG.TARGET_CENTER_Y + GAME_CONFIG.TARGET_RADIUS + 15
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
                    const currentTargetRotation = prev.targetRotation;
                    // Calculate the impact angle relative to the current target rotation
                    const impactAngle = (360 - currentTargetRotation) % 360;
                    //const impactAngle = (180 + currentTargetRotation) % 360;
                    //const impactAngle = currentTargetRotation % 360;

                    // Check collision with existing knives at impact moment
                    if (checkKnifeCollision(impactAngle, prev.plantedKnives)) {
                        return { ...prev, gameStatus: 'gameOver' };
                    }

                    // Check apple collision at impact moment
                    const impactHitApple = checkAppleCollision(impactAngle, prev.apples);

                    const newPlantedKnife: PlantedKnife = {
                        id: newKnife.id,
                        angle: impactAngle,
                    };

                    const newState = {
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

                    console.log(`currentAngle:`, gameState.targetRotation)
                    console.log(`impactAngle:`, impactAngle)
                    console.log(`newPlantedKnife:`, newPlantedKnife)

                    // Check if level is complete
                    if (newState.knivesRemaining <= 0) {
                        return { ...newState, gameStatus: 'levelComplete' };
                    }

                    return newState;
                });

                // Remove knife from throwing knives
                setThrowingKnives(prev => prev.filter(knife => knife.id !== newKnife.id));

                //pauseGame(); // DEBUG
            }
        };

        requestAnimationFrame(animate);
    }, [gameState.knivesRemaining, gameState.gameStatus, gameState.targetRotation, gameState.plantedKnives, gameState.apples]);

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            level: 1,
            score: 0,
            gameStatus: 'menu',
        }));
        setThrowingKnives([]);
    }, []);

    return {
        gameState,
        throwingKnives,
        startGame,
        nextLevel,
        throwKnife,
        resetGame,
        pauseGame,
        unpauseGame,
    };
};

