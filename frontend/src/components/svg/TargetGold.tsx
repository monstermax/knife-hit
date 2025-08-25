import React from 'react';

interface TargetGoldProps {
    size?: number;
    className?: string;
}

export const TargetGold: React.FC<TargetGoldProps> = ({
    size = 200,
    className = ''
}) => {
    const radius = size / 2;
    const center = radius;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={className}
        >
            {/* Anneau extérieur or */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="url(#monadRing)"
                stroke="#9945FF"
                strokeWidth="5"
            />
            {/* Anneau intérieur */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.8}
                fill="url(#monadInner)"
                stroke="#2D1A4A"
                strokeWidth="3"
            />
            {/* Anneau rose/violet */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.6}
                fill="none"
                stroke="#FF6EFF"
                strokeWidth="5"
                opacity="0.7"
            />
            {/* Effet bling */}
            <ellipse
                cx={center + radius * 0.3}
                cy={center - radius * 0.5}
                rx={radius * 0.13}
                ry={radius * 0.05}
                fill="#fff"
                opacity="0.7"
                transform={`rotate(-20,${center + radius * 0.3},${center - radius * 0.5})`}
            />
            <ellipse
                cx={center - radius * 0.25}
                cy={center + radius * 0.45}
                rx={radius * 0.09}
                ry={radius * 0.03}
                fill="#FF6EFF"
                opacity="0.5"
                transform={`rotate(15,${center - radius * 0.25},${center + radius * 0.45})`}
            />
            {/* Centre */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.18}
                fill="url(#monadCore)"
                stroke="#9945FF"
                strokeWidth="2"
                opacity="0.95"
            />

            {/* Center Monad logo */}
            <foreignObject
                x={center - radius * 0.25}
                y={center - radius * 0.25}
                width={radius * 0.5}
                height={radius * 0.5}
            >
                <img
                    src="/images/logo_monad_red.webp"
                    alt="Monad"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                />
            </foreignObject>

            <defs>
                <radialGradient id="monadRing" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#9945FF" />
                    <stop offset="60%" stopColor="#FF6EFF" />
                    <stop offset="100%" stopColor="#2D1A4A" />
                </radialGradient>
                <radialGradient id="monadInner" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#9945FF" />
                </radialGradient>
                <radialGradient id="monadCore" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#FF6EFF" />
                </radialGradient>
            </defs>
        </svg>
    );
};