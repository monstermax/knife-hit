import React from 'react';


interface LemonTargetProps {
    size?: number;
    className?: string;
}


export const LemonTarget: React.FC<LemonTargetProps> = ({
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
            {/* Outer lemon ring */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="url(#lemonGradient)"
                stroke="#DAA520"
                strokeWidth="3"
            />

            {/* Lemon segments */}
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const x1 = center;
                const y1 = center;
                const x2 = center + Math.cos(angle) * radius;
                const y2 = center + Math.sin(angle) * radius;

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#DAA520"
                        strokeWidth="2"
                        opacity="0.6"
                    />
                );
            })}

            {/* Inner circles for depth */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.8}
                fill="none"
                stroke="#F0E68C"
                strokeWidth="2"
                opacity="0.7"
            />

            <circle
                cx={center}
                cy={center}
                r={radius * 0.6}
                fill="none"
                stroke="#DAA520"
                strokeWidth="2"
                opacity="0.5"
            />

            <circle
                cx={center}
                cy={center}
                r={radius * 0.4}
                fill="none"
                stroke="#F0E68C"
                strokeWidth="2"
                opacity="0.7"
            />

            <circle
                cx={center}
                cy={center}
                r={radius * 0.2}
                fill="none"
                stroke="#DAA520"
                strokeWidth="2"
                opacity="0.5"
            />

            {/* Center dot */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.05}
                fill="#DAA520"
            />

            {/* Lemon texture - small circles for pulp effect */}
            {Array.from({ length: 20 }, (_, i) => {
                const angle = (i * 18) * (Math.PI / 180);
                const distance = radius * 0.3 + (i % 3) * radius * 0.15;
                const x = center + Math.cos(angle) * distance;
                const y = center + Math.sin(angle) * distance;

                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#FFFF99"
                        opacity="0.4"
                    />
                );
            })}

            {/* Gradients */}
            <defs>
                <radialGradient id="lemonGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#FFFF99" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#DAA520" />
                </radialGradient>
            </defs>
        </svg>
    );
};

