import React from 'react';

interface KnifePoignardProps {
    size?: number;
    className?: string;
}

export const KnifePoignard: React.FC<KnifePoignardProps> = ({
    size = 60,
    className = ''
}) => {
    const width = size * 0.38;
    const height = size;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
        >
            {/* Lame courte et large */}
            <path
                d={`
                    M ${width * 0.5} 0
                    Q ${width * 0.8} ${height * 0.25}, ${width * 0.7} ${height * 0.55}
                    L ${width * 0.5} ${height * 0.7}
                    L ${width * 0.3} ${height * 0.55}
                    Q ${width * 0.2} ${height * 0.25}, ${width * 0.5} 0
                    Z
                `}
                fill="url(#poignardBladeGradient)"
                stroke="#1E90FF"
                strokeWidth="2"
            />

            {/* Reflet */}
            <path
                d={`
                    M ${width * 0.5} ${height * 0.08}
                    Q ${width * 0.65} ${height * 0.3}, ${width * 0.6} ${height * 0.55}
                    L ${width * 0.52} ${height * 0.65}
                    Q ${width * 0.54} ${height * 0.4}, ${width * 0.5} ${height * 0.08}
                    Z
                `}
                fill="#fff"
                opacity="0.18"
            />

            {/* Garde bleue */}
            <ellipse
                cx={width * 0.5}
                cy={height * 0.7}
                rx={width * 0.22}
                ry={height * 0.055}
                fill="url(#poignardGuardGradient)"
                stroke="#1E90FF"
                strokeWidth="1.2"
            />

            {/* Manche doré */}
            <rect
                x={width * 0.38}
                y={height * 0.74}
                width={width * 0.24}
                height={height * 0.19}
                fill="url(#poignardHandleGradient)"
                stroke="#FFD700"
                strokeWidth="1.2"
                rx="4"
            />

            {/* Anneaux sur le manche */}
            <g>
                <rect x={width * 0.38} y={height * 0.78} width={width * 0.24} height={height * 0.025} fill="#FFD700" opacity="0.7" rx="2"/>
                <rect x={width * 0.38} y={height * 0.83} width={width * 0.24} height={height * 0.025} fill="#FFD700" opacity="0.5" rx="2"/>
            </g>

            {/* Pommel */}
            <circle
                cx={width * 0.5}
                cy={height * 0.97}
                r={width * 0.09}
                fill="url(#poignardPommelGradient)"
                stroke="#FFD700"
                strokeWidth="1.2"
            />

            <defs>
                <linearGradient id="poignardBladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E90FF" />
                    <stop offset="60%" stopColor="#87CEFA" />
                    <stop offset="100%" stopColor="#fff" />
                </linearGradient>
                <linearGradient id="poignardGuardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E90FF" />
                    <stop offset="100%" stopColor="#87CEFA" />
                </linearGradient>
                <linearGradient id="poignardHandleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFFACD" />
                </linearGradient>
                <radialGradient id="poignardPommelGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
            </defs>
        </svg>
    );
};