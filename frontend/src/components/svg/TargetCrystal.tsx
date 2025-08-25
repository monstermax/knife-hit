import React from 'react';

interface TargetCrystalProps {
    size?: number;
    className?: string;
}

export const TargetCrystal: React.FC<TargetCrystalProps> = ({
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
            {/* Fond cristal polygonal */}
            <polygon
                points={`
                    ${center},${center - radius * 0.95}
                    ${center + radius * 0.7},${center - radius * 0.7}
                    ${center + radius * 0.95},${center}
                    ${center + radius * 0.7},${center + radius * 0.7}
                    ${center},${center + radius * 0.95}
                    ${center - radius * 0.7},${center + radius * 0.7}
                    ${center - radius * 0.95},${center}
                    ${center - radius * 0.7},${center - radius * 0.7}
                `}
                fill="url(#crystalGradient)"
                stroke="#A5B4FC"
                strokeWidth="4"
                opacity="0.95"
            />
            {/* Reflets */}
            <polygon
                points={`
                    ${center},${center - radius * 0.7}
                    ${center + radius * 0.4},${center - radius * 0.4}
                    ${center + radius * 0.7},${center}
                    ${center + radius * 0.4},${center + radius * 0.4}
                    ${center},${center + radius * 0.7}
                    ${center - radius * 0.4},${center + radius * 0.4}
                    ${center - radius * 0.7},${center}
                    ${center - radius * 0.4},${center - radius * 0.4}
                `}
                fill="url(#crystalLight)"
                opacity="0.7"
            />
            {/* Centre */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.18}
                fill="url(#crystalCore)"
                stroke="#fff"
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
                <radialGradient id="crystalGradient" cx="50%" cy="40%" r="80%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="60%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#312E81" />
                </radialGradient>
                <radialGradient id="crystalLight" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="80%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#312E81" />
                </radialGradient>
                <radialGradient id="crystalCore" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#818CF8" />
                </radialGradient>
            </defs>
        </svg>
    );
};