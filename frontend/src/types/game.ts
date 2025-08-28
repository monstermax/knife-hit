import type { LoginModalOptions, usePrivy, User } from '@privy-io/react-auth';


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
    type: 'apple' | 'john' | 'mouch' | 'bill' | 'port' | 'keone' | 'pepe';
}

export type GameFullState = {
    authenticated: boolean;
    user: User | null;
    gameState: GameState;
    throwingKnives: ThrowingKnife[];
    accountAddress: string | null,
    username: string | null,
    ready: boolean,
    loading: boolean,
    error: string | null,
    login: (options?: LoginModalOptions | React.MouseEvent<any, any>) => void;
    logout: () => Promise<void>;
    startGame: (playerAddress?: string | null) => void;
    nextLevel: () => void;
    throwKnife: () => void;
    resetGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    quitGame: () => void;
    setAccountAddress: React.Dispatch<React.SetStateAction<string | null>>,
    setUsername: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    handleCreateWallet: () => Promise<void>,
}

export interface GameState {
    playerAddress: string | null,
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
    cycle: {
        duration: number;  // durée du cycle en ms
        min: number;       // facteur multiplicateur minimum
        max: number;       // facteur multiplicateur maximum  
        clockwise: boolean; // direction (pour usage futur)
    };
}

export interface ThrowingKnife {
    id: string;
    position: Position;
    progress: number;
    isThrown: boolean;
}


export type LeaderboardResult = {
    data: LeaderboardEntry[];
    pagination: {
        page: number
        limit: number
        total: string
        totalPages: number
    }
    sortBy: string
    sortOrder: string
    gameId: any
};


export type LeaderboardEntry = {
    userId: number
    username: string
    walletAddress: string
    score?: number
    transactionCount?: number
    gameId: number | null
    gameName: string
    rank: number
}

