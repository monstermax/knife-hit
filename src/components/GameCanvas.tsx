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

        const markers = [0, 45, 90, 135, 180, 225, 270, 315].map((angle, id) => ({ id, angle }))

        return (
            <div
                className="target-container"
                style={{
                    transform: `translate(-50%, -100%) rotate(${gameState.targetRotation}deg)`,
                }}
            >
                <TargetComponent size={GAME_CONFIG.TARGET_RADIUS * 2} />

                {/* Render planted knives - only handles visible */}
                {gameState.plantedKnives.map((knife) => {
                    const knifeRotation = 200; // TODO

                    return (
                        <div
                            key={knife.id}
                            className="absolute"
                            title={`Knife #${knife.id} | angle=${knife.angle}`}
                            style={{
                                //transform: `rotate(${knife.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS - 5}px)`,
                                transform: `rotate(${knife.angle}deg) translateX(-50%) translateY(20%)`,
                                transformOrigin: '0% 0%',
                                left: '50%',
                                top: '50%',
                                //marginLeft: '-9px',
                                //marginTop: '-20px',
                                zIndex: debug ? 10 : -1,
                                border: debug ? 'solid 1px blue': '', // debug
                                borderTop: debug ? 'solid 1px red': '', // debug
                            }}
                        >
                            <Knife size={150} rotation={knifeRotation} />
                        </div>
                    )
                })}

                {/* Render apples */}
                {gameState.apples.map((apple) => (
                    !apple.collected && (
                        <div
                            key={apple.id}
                            className="absolute"
                            title={`Apple #${apple.id} | angle=${apple.angle}`}
                            style={{
                                //transform: `rotate(${apple.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS - 20}px)`,
                                //transformOrigin: '50% 100%',
                                left: '50%',
                                top: '50%',
                                transform: `rotate(${apple.angle}deg) translateX(-50%) translateY(-300%)`,
                                transformOrigin: '0% 0%',
                                //left: '-10px',
                                //top: '-10px',
                                //marginLeft: '-15px',
                                //marginTop: '-15px',
                                border: (debug) ? 'solid 1px yellow' : '',
                            }}
                        >
                            <Apple size={50} />
                        </div>
                    )
                ))}

                {/* Render markers */}
                {markers.map((marker) => (
                    <div
                        key={marker.id}
                        className="absolute"
                        title={`Apple #${marker.id} | angle=${marker.angle}`}
                        style={{
                            //transform: `rotate(${apple.angle}deg) translateY(-${GAME_CONFIG.TARGET_RADIUS - 20}px)`,
                            //transformOrigin: '50% 100%',
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${marker.angle}deg) translateX(-50%) translateY(-300%)`,
                            transformOrigin: '0% 0%',
                            //left: '-10px',
                            //top: '-10px',
                            //marginLeft: '-15px',
                            //marginTop: '-15px',
                            border: (debug||1) ? 'solid 1px red' : '',
                        }}
                    >
                        {marker.angle}
                    </div>
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

