
import { CrossAppAccountWithMetadata, User } from '@privy-io/react-auth';
import { PlantedKnife, AppleItem, LevelConfig, Position } from '../types/game';


export const GAME_CONFIG = {
    TARGET_RADIUS: 120,
    KNIFE_LENGTH: 30,
    COLLISION_THRESHOLD: 10, // degrees
    APPLE_COLLISION_THRESHOLD: 10, // degrees
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 600,
    TARGET_CENTER_X: 200,
    TARGET_CENTER_Y: 200,
};


export const generateLevelConfig = (level: number): LevelConfig => {
    const isBoss = level % 5 === 0;
    const clockwise = (Math.random() < 0.5);

    if (isBoss) {
        return {
            knivesToThrow: Math.min(8 + Math.floor(level / 5), 15),
            preKnives: Math.min(3 + Math.floor(level / 3), 8),
            appleCount: Math.round(Math.min(2 + Math.random()*3 + Math.floor(level / 10), 5)),
            rotationSpeed: Math.min(3 + level * 0.1, 3) * (clockwise ? 1 : -1),
            targetType: 'lemon',
            isBoss: true,
            cycle: { duration: 5000, min: 0.5, max: 2 + level * 0.1, clockwise },
        };
    }

    return {
        knivesToThrow: Math.min(6 + Math.floor(level / 2), 12),
        preKnives: Math.min(Math.floor(level / 2), 6),
        appleCount: Math.round(Math.min(1 + Math.random()*3 + Math.floor(level / 5), 6)),
        rotationSpeed: Math.min(20 + level * 0.05, 2) * (clockwise ? 1 : -1),
        targetType: 'wood',
        isBoss: false,
        cycle: { duration: 5000, min: 0.5, max: 1.5 + level * 0.1, clockwise },
    };

};


export const generateRandomAngle = (): number => {
    return Math.random() * 360;
};


export const generatePreKnives = (count: number): PlantedKnife[] => {
    const knives: PlantedKnife[] = [];
    const minAngleDifference = 360 / Math.max(count, 4); // Ensure minimum spacing

    for (let i = 0; i < count; i++) {
        let angle: number;
        let attempts = 0;

        do {
            angle = generateRandomAngle();
            attempts++;
        } while (
            attempts < 50 &&
            knives.some(knife =>
                Math.abs(normalizeAngle(knife.angle - angle)) < minAngleDifference
            )
        );

        knives.push({
            id: `pre-knife-${i}`,
            angle,
        });
    }

    return knives;
};


export const generateApples = (count: number, plantedKnives: PlantedKnife[]): AppleItem[] => {
    const apples: AppleItem[] = [];

    for (let i = 0; i < count; i++) {
        let angle: number;
        let attempts = 0;

        do {
            angle = generateRandomAngle();
            attempts++;
        } while (
            attempts < 50 &&
            (plantedKnives.some(knife =>
                Math.abs(normalizeAngle(knife.angle - angle)) < GAME_CONFIG.APPLE_COLLISION_THRESHOLD
            ) || apples.some(apple =>
                Math.abs(normalizeAngle(apple.angle - angle)) < GAME_CONFIG.APPLE_COLLISION_THRESHOLD
            ))
        );

        let rand = Math.random();
        let type: AppleItem['type'] = 'apple';
        if (rand < 1)   type = 'john';
        if (rand < 0.7) type = 'mouch';
        if (rand < 0.5) type = 'pepe';
        if (rand < 0.3) type = 'bill';
        if (rand < 0.2) type = 'port';
        if (rand < 0.1) type = 'keone';

        apples.push({
            id: `apple-${i}`,
            angle,
            position: angleToPosition(angle, GAME_CONFIG.TARGET_RADIUS - 20),
            collected: false,
            type,
        });
    }

    return apples;
};


export const angleToPosition = (angle: number, radius: number): Position => {
    const radian = (angle * Math.PI) / 180;
    return {
        x: GAME_CONFIG.TARGET_CENTER_X + Math.cos(radian) * radius,
        y: GAME_CONFIG.TARGET_CENTER_Y + Math.sin(radian) * radius,
    };
};


export const normalizeAngle = (angle: number): number => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
};


export const checkKnifeCollision = (
    newKnifeAngle: number,
    plantedKnives: PlantedKnife[]
): boolean => {
    return plantedKnives.some(knife =>
        Math.abs(normalizeAngle(knife.angle - newKnifeAngle)) < GAME_CONFIG.COLLISION_THRESHOLD
    );
};


export const checkAppleCollision = (
    knifeAngle: number,
    apples: AppleItem[]
): AppleItem | null => {
    return apples.find(apple =>
        !apple.collected &&
        Math.abs(normalizeAngle(apple.angle - knifeAngle)) < GAME_CONFIG.APPLE_COLLISION_THRESHOLD
    ) || null;
};


export const calculateScore = (level: number, applesCollected: number): number => {
    return level * 10 + applesCollected * 5;
};



export const getUserAddress = (user: User | null) => {
    if (user) {
        const crossAppAccount = user.linkedAccounts.find(
            account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
        ) as CrossAppAccountWithMetadata;

        if (crossAppAccount?.embeddedWallets.length > 0) {
            const walletAddress = crossAppAccount.embeddedWallets[0].address;
            return walletAddress;
        }
    }

    return null;
}


export const calculateCycleMultiplier = (
    gameStartTime: number,
    currentTime: number,
    cycle: { duration: number; min: number; max: number; clockwise: boolean }
): { multiplier: number; cycleInfo: { cycleNumber: number; progress: number } } => {
    const totalElapsed = currentTime - gameStartTime;
    const cycleNumber = Math.floor(totalElapsed / cycle.duration);
    const elapsed = totalElapsed % cycle.duration;
    const progress = elapsed / cycle.duration; // 0 à 1

    // Générer une valeur "aléatoire" mais reproductible basée sur le numéro de cycle
    const generateTargetValue = (cycleNum: number): number => {
        // Utiliser le numéro de cycle pour générer une valeur reproductible
        const seed = (cycleNum * 9301 + 49297) % 233280;
        const random = seed / 233280;
        return cycle.min + (cycle.max - cycle.min) * random;
    };

    if (cycleNumber === 0) {
        // Premier cycle : progression normale de min vers max
        const range = cycle.max - cycle.min;
        const multiplier = cycle.min + (range * progress);
        return {
            multiplier,
            cycleInfo: { cycleNumber, progress }
        };
    }

    // Cycles suivants : continuité assurée
    const previousTarget = generateTargetValue(cycleNumber - 1);
    const currentTarget = generateTargetValue(cycleNumber);

    let startValue, endValue;

    if (currentTarget > previousTarget) {
        // La nouvelle cible est plus haute : on monte
        startValue = previousTarget;
        endValue = currentTarget;
    } else {
        // La nouvelle cible est plus basse : on descend
        startValue = currentTarget;
        endValue = previousTarget;
        // Inverser la progression pour descendre
        const invertedProgress = 1 - progress;
        const multiplier = startValue + (endValue - startValue) * invertedProgress;
        return {
            multiplier,
            cycleInfo: { cycleNumber, progress }
        };
    }

    const multiplier = startValue + (endValue - startValue) * progress;
    return {
        multiplier,
        cycleInfo: { cycleNumber, progress }
    };
};

