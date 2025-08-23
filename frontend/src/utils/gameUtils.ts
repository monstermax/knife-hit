
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

    if (isBoss) {
        return {
            knivesToThrow: Math.min(8 + Math.floor(level / 5), 15),
            preKnives: Math.min(3 + Math.floor(level / 3), 8),
            appleCount: Math.min(2 + Math.floor(level / 10), 4),
            rotationSpeed: Math.min(3 + level * 0.1, 3),
            targetType: 'lemon',
            isBoss: true,
        };
    }

    return {
        knivesToThrow: Math.min(6 + Math.floor(level / 2), 12),
        preKnives: Math.min(Math.floor(level / 2), 6),
        appleCount: Math.min(1 + Math.floor(level / 5), 3),
        rotationSpeed: Math.min(20 + level * 0.05, 2),
        targetType: 'wood',
        isBoss: false,
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

        apples.push({
            id: `apple-${i}`,
            angle,
            position: angleToPosition(angle, GAME_CONFIG.TARGET_RADIUS - 20),
            collected: false,
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

