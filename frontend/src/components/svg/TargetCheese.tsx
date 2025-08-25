import React from 'react';

interface TargetCheeseProps {
    size?: number;
    className?: string;
}

export const TargetCheese: React.FC<TargetCheeseProps> = ({
    size = 200,
    className = ''
}) => {
    const radius = size / 2;
    const center = radius;

    // Positions relatives pour les trous
    const holes = [
        { x: 0.32, y: 0.28, r: 0.13, o: 0.7 },
        { x: 0.7, y: 0.35, r: 0.09, o: 0.5 },
        { x: 0.6, y: 0.7, r: 0.07, o: 0.6 },
        { x: 0.4, y: 0.7, r: 0.06, o: 0.5 },
        { x: 0.5, y: 0.5, r: 0.08, o: 0.7 },
        { x: 0.75, y: 0.6, r: 0.06, o: 0.4 },
        { x: 0.25, y: 0.6, r: 0.05, o: 0.4 }
    ];

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={className}
        >
            {/* Fond fromage */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="url(#cheeseGradient)"
                stroke="#FBBF24"
                strokeWidth="5"
            />
            {/* Anneau intérieur plus foncé */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.8}
                fill="url(#cheeseInner)"
                stroke="#F59E42"
                strokeWidth="3"
            />
            {/* Trous */}
            {holes.map((h, i) => (
                <circle
                    key={i}
                    cx={center + (h.x - 0.5) * radius * 1.6}
                    cy={center + (h.y - 0.5) * radius * 1.6}
                    r={radius * h.r}
                    fill="#fff9c2"
                    opacity={h.o}
                    stroke="#F59E42"
                    strokeWidth="1"
                />
            ))}
            {/* Centre */}
            <circle
                cx={center}
                cy={center}
                r={radius * 0.18}
                fill="#fffde7"
                stroke="#FBBF24"
                strokeWidth="2"
                opacity="0.95"
            />
            <defs>
                <radialGradient id="cheeseGradient" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="60%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E42" />
                </radialGradient>
                <radialGradient id="cheeseInner" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#fffde7" />
                    <stop offset="100%" stopColor="#FBBF24" />
                </radialGradient>
            </defs>
        </svg>
    );
};