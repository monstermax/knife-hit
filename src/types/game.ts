import type { usePrivy } from '@privy-io/react-auth';


export type PrivyUser = ReturnType<typeof usePrivy>['user'];


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

export type GameFullState = {
    gameState: GameState;
    throwingKnives: ThrowingKnife[];
    startGame: (user?: PrivyUser | null) => void;
    nextLevel: () => void;
    throwKnife: () => void;
    resetGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    quitGame: () => void;
}

export interface GameState {
    user: PrivyUser | null,
    level: number;
    score: number;
    totalApples: number;
    knivesRemaining: number;
    plantedKnives: PlantedKnife[];
    apples: AppleItem[];
    targetRotation: number;
    rotationSpeed: number;
    gameStatus: 'loading' | 'home' | 'playing' | 'gameOver' | 'levelComplete' | 'pause';
    targetType: 'wood' | 'lemon';
    isBossLevel: boolean;
    bestScore: number,
    bestLevel: number,
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

