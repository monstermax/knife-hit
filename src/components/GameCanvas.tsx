import React from 'react';

import { WoodTarget, LemonTarget, Knife, Apple } from './svg';
import { GAME_CONFIG } from '../utils/gameUtils';
import { KnifeHandle } from './svg/KnifeHandle';

import type { GameState, ThrowingKnife } from '../types/game';


interface GameCanvasProps {
    gameState: GameState;
    throwingKnives: ThrowingKnife[];
    onThrowKnife: () => void;
}


export const GameCanvas: React.FC<GameCanvasProps> = ({
    gameState,
    throwingKnives,
    onThrowKnife
}) => {
    const renderTarget = () => {
        const TargetComponent = gameState.targetType === 'lemon' ? LemonTarget : WoodTarget;

        return (
            <div
                className="target-container"
                style={{
                    transform: `translate(-50%, -100%) rotate(${gameState.targetRotation}deg)`,
                }}
            >
                <TargetComponent size={GAME_CONFIG.TARGET_RADIUS * 2} />

                {/* Render planted knives - only handles visible */}
                {gameState.plantedKnives.map((knife) => (
                    <div
                        key={knife.id}
                        className="absolute"
                        style={{
                            transform: `rotate(${knife.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS - 5}px)`,
                            transformOrigin: '50% 35%',
                            left: '50%',
                            top: '50%',
                            marginLeft: '-9px',
                            marginTop: '-20px',
                            zIndex: -1,
                        }}
                    >
                        <Knife size={150} rotation={200} />
                    </div>
                ))}

                {/* Render apples */}
                {gameState.apples.map((apple) => (
                    !apple.collected && (
                        <div
                            key={apple.id}
                            className="absolute"
                            style={{
                                transform: `rotate(${apple.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS - 20}px)`,
                                transformOrigin: '50% 100%',
                                left: '50%',
                                top: '50%',
                                marginLeft: '-15px',
                                marginTop: '-15px',
                            }}
                        >
                            <Apple size={20} />
                        </div>
                    )
                ))}
            </div>
        );
    };

    const renderThrowingKnives = () => {
        return throwingKnives.map((knife) => {
            const startY = GAME_CONFIG.CANVAS_HEIGHT - 100;
            const endY = GAME_CONFIG.TARGET_CENTER_Y + GAME_CONFIG.TARGET_RADIUS + 15;
            const currentY = startY + (endY - startY) * knife.progress;

            return (
                <div
                    key={knife.id}
                    className="absolute z-10"
                    style={{
                        left: '50%',
                        top: `${currentY}px`,
                        transform: 'translateX(-50%)',
                        transition: 'none',
                    }}
                >
                    <Knife size={120} />
                </div>
            );
        });
    };

    const renderCurrentKnife = () => {
        if (gameState.knivesRemaining <= 0) return null;

        return (
            <div
                className="current-knife"
                onClick={onThrowKnife}
            >
                <Knife size={150} />
            </div>
        );
    };

    const renderKnivesRemaining = () => {
        return (
            <div className="knives-remaining">
                {Array.from({ length: gameState.knivesRemaining }, (_, i) => (
                    <div key={i} className="knife-indicator" />
                ))}
            </div>
        );
    };

    const onclickCanvas = () => {
        // Debug
        //gameState.gameStatus = (gameState.gameStatus === 'playing') ? 'pause' : 'playing';
    }

    return (
        <div 
            className="game-canvas"
            onClick={ () => onclickCanvas() }
            >
            {renderTarget()}
            {renderThrowingKnives()}
            {renderCurrentKnife()}
            {renderKnivesRemaining()}
        </div>
    );
};

