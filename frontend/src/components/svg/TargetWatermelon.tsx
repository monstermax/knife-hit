import React from 'react';

interface TargetWatermelonProps {
    size?: number;
    className?: string;
}

export const TargetWatermelon: React.FC<TargetWatermelonProps> = ({
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
            {/* Peau verte */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="url(#watermelonSkin)"
                stroke="#166534"
                strokeWidth="4"
            />
            {/* Chair rose */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.82}
                fill="url(#watermelonFlesh)"
                stroke="#F472B6"
                strokeWidth="2"
            />
            {/* Anneau blanc */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.7}
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                opacity="0.7"
            />
            {/* Graines */}
            {Array.from({ length: 10 }, (_, i) => {
                const angle = (i * 36) * (Math.PI / 180);
                const r = radius * 0.6;
                const x = center + Math.cos(angle) * r;
                const y = center + Math.sin(angle) * r;
                return (
                    <ellipse
                        key={i}
                        cx={x}
                        cy={y}
                        rx={radius * 0.06}
                        ry={radius * 0.13}
                        fill="#222"
                        transform={`rotate(${angle * 180 / Math.PI},${x},${y})`}
                        opacity="0.85"
                    />
                );
            })}
            {/* Centre */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.18}
                fill="#fff"
                stroke="#F472B6"
                strokeWidth="2"
                opacity="0.95"
            />

            {/* Center Monad logo */}
            <foreignObject
                x={center - radius * 0.15}
                y={center - radius * 0.15}
                width={radius * 0.3}
                height={radius * 0.3}
            >
                <img
                    src="/images/logo_monad.webp"
                    alt="Monad"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                />
            </foreignObject>

            <defs>
                <radialGradient id="watermelonSkin" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#166534" />
                </radialGradient>
                <radialGradient id="watermelonFlesh" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fff1f2" />
                    <stop offset="100%" stopColor="#F472B6" />
                </radialGradient>
            </defs>
        </svg>
    );
};