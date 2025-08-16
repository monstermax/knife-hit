
export interface Position {
    x: number;
    y: number;
}

export interface PlantedKnife {
    id: string;
    angle: number;
}

export interface AppleItem {
    id: string;
    angle: number;
    position: Position;
    collected: boolean;
}

export interface GameState {
    level: number;
    score: number;
    totalApples: number;
    knivesRemaining: number;
    plantedKnives: PlantedKnife[];
    apples: AppleItem[];
    targetRotation: number;
    rotationSpeed: number;
    gameStatus: 'playing' | 'gameOver' | 'levelComplete' | 'menu' | 'pause';
    targetType: 'wood' | 'lemon';
    isBossLevel: boolean;
}

export interface LevelConfig {
    knivesToThrow: number;
    preKnives: number;
    appleCount: number;
    rotationSpeed: number;
    targetType: 'wood' | 'lemon';
    isBoss: boolean;
}

export interface ThrowingKnife {
    id: string;
    position: Position;
    targetPosition: Position;
    progress: number;
    isThrown: boolean;
}

