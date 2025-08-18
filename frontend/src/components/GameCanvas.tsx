import React from 'react';

import { WoodTarget, LemonTarget, Knife, Apple } from './svg';
import { GAME_CONFIG } from '../utils/gameUtils';

import type { GameState, ThrowingKnife } from '../types/game';


interface GameCanvasProps {
    gameState: GameState;
    throwingKnives: ThrowingKnife[];
    onThrowKnife: () => void;
}


const debug = false;


export const GameCanvas: React.FC<GameCanvasProps> = ({
    gameState,
    throwingKnives,
    onThrowKnife
}) => {
    const renderTarget = () => {
        const TargetComponent = gameState.targetType === 'lemon' ? LemonTarget : WoodTarget;

        const markers = debug ? [0, 45, 90, 135, 180, 225, 270, 315].map((angle, id) => ({ id, angle })) : []

        return (
            <div
                className="target-container"
                style={{
                    transform: `translate(-50%, -100%) rotate(${gameState.targetRotation}deg)`,
                    border: (debug) ? 'solid 1px pink' : '',
                    zIndex: 10,
                }}
            >
                <TargetComponent size={GAME_CONFIG.TARGET_RADIUS * 2} />

                {/* Render planted knives - only handles visible */}
                {renderPlantedKnives()}

                {/* Render apples */}
                {renderApples()}

                {/* Render markers */}
                {renderMarkers(markers)}
            </div>
        );
    };

    const renderMarkers = (markers: {id: number, angle: number}[]) => {
        return markers.map((marker) => (
            <div
                key={marker.id}
                className="absolute"
                title={`Marker #${marker.id} | angle=${marker.angle}`}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${marker.angle}deg) translateX(-50%) translateY(-300%)`,
                    transformOrigin: '0% 0%',
                    border: (debug||1) ? 'solid 1px red' : '', // debug
                    zIndex: 15,
                }}
            >
                {marker.angle}
            </div>
        ));
    }

    const renderApples = () => {
        return gameState.apples.map((apple) => (
            !apple.collected && (
                <div
                    key={apple.id}
                    className="absolute"
                    title={`Apple #${apple.id} | angle=${apple.angle}`}
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: `translateX(-50%) translateY(-50%) rotate(${apple.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS+30}px)`,
                        transformOrigin: '50% 50%',
                        border: (debug) ? 'solid 1px yellow' : '', // debug
                        zIndex: -20,
                    }}
                >
                    <Apple size={50} />
                </div>
            )
        ));
    }

    const renderPlantedKnives = () => {
        const lameLength = 80;

        return gameState.plantedKnives.map((knife) => {
            return (
                <div
                    key={knife.id}
                    className="absolute"
                    title={`Knife #${knife.id} | angle=${knife.angle}`}
                    style={{
                        transform: `rotate(${(180+knife.angle)%360}deg) translateX(-50%) translateY(${GAME_CONFIG.TARGET_RADIUS - lameLength}px)`,
                        transformOrigin: '0% 0%',
                        left: '50%',
                        top: '50%',
                        zIndex: debug ? 20 : -10,
                        border: debug ? 'solid 1px blue': '', // debug
                        borderTop: debug ? 'solid 1px red': '', // debug
                    }}
                >
                    <Knife size={150} />
                </div>
            )
        });
    }

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
                        zIndex: 5,
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
            >
                <Knife size={120} />
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
        onThrowKnife()

        // Debug
        //gameState.gameStatus = (gameState.gameStatus === 'playing') ? 'pause' : 'playing';
    }

    return (
        <div 
            className="game-canvas cursor-pointer"
            onClick={ () => onclickCanvas() }
            >
            {renderTarget()}
            {renderThrowingKnives()}
            {renderCurrentKnife()}
            {renderKnivesRemaining()}
        </div>
    );
};

