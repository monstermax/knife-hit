import React from 'react';

interface KnifeMonadProps {
    size?: number;
    className?: string;
}

export const KnifeMonad: React.FC<KnifeMonadProps> = ({
    size = 60,
    className = ''
}) => {
    const width = size * 0.45;
    const height = size;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
        >
            {/* Lame violette flashy */}
            <path
                d={`
                    M ${width * 0.5} 0
                    Q ${width * 0.7} ${height * 0.25}, ${width * 0.7} ${height * 0.6}
                    L ${width * 0.5} ${height * 0.7}
                    L ${width * 0.3} ${height * 0.6}
                    Q ${width * 0.3} ${height * 0.25}, ${width * 0.5} 0
                    Z
                `}
                fill="url(#monadBladeGradient)"
                stroke="#9945FF"
                strokeWidth="2"
                filter="url(#glow)"
            />

            {/* Reflet sur la lame */}
            <path
                d={`
                    M ${width * 0.5} ${height * 0.05}
                    Q ${width * 0.62} ${height * 0.3}, ${width * 0.6} ${height * 0.55}
                    L ${width * 0.52} ${height * 0.65}
                    Q ${width * 0.54} ${height * 0.4}, ${width * 0.5} ${height * 0.05}
                    Z
                `}
                fill="#fff"
                opacity="0.25"
            />

            {/* Garde dorée */}
            <ellipse
                cx={width * 0.5}
                cy={height * 0.7}
                rx={width * 0.22}
                ry={height * 0.045}
                fill="url(#monadGuardGradient)"
                stroke="#FFD700"
                strokeWidth="1.2"
            />

            {/* Manche bling */}
            <rect
                x={width * 0.38}
                y={height * 0.72}
                width={width * 0.24}
                height={height * 0.22}
                fill="url(#monadHandleGradient)"
                stroke="#FFD700"
                strokeWidth="1.2"
                rx="5"
            />

            {/* Anneaux sur le manche */}
            <g>
                <rect x={width * 0.38} y={height * 0.76} width={width * 0.24} height={height * 0.025} fill="#FFD700" opacity="0.7" rx="2"/>
                <rect x={width * 0.38} y={height * 0.81} width={width * 0.24} height={height * 0.025} fill="#FFD700" opacity="0.5" rx="2"/>
                <rect x={width * 0.38} y={height * 0.86} width={width * 0.24} height={height * 0.025} fill="#FFD700" opacity="0.7" rx="2"/>
            </g>

            {/* Pommel (bout du manche) */}
            <circle
                cx={width * 0.5}
                cy={height * 0.97}
                r={width * 0.09}
                fill="url(#pommelGradient)"
                stroke="#FFD700"
                strokeWidth="1.2"
            />

            {/* Petit logo Monad sur la garde */}
            <circle
                cx={width * 0.5}
                cy={height * 0.7}
                r={width * 0.07}
                fill="#fff"
                stroke="#9945FF"
                strokeWidth="1"
            />
            <text
                x={width * 0.5}
                y={height * 0.71}
                textAnchor="middle"
                fontSize={width * 0.08}
                fontWeight="bold"
                fill="#9945FF"
                style={{ fontFamily: 'monospace' }}
            >M</text>

            {/* Dégradés et effets */}
            <defs>
                <linearGradient id="monadBladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9945FF" />
                    <stop offset="60%" stopColor="#FF6EFF" />
                    <stop offset="100%" stopColor="#fff" />
                </linearGradient>
                <linearGradient id="monadGuardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFFACD" />
                </linearGradient>
                <linearGradient id="monadHandleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFACD" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <radialGradient id="pommelGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
};