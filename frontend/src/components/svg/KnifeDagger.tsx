import React from 'react';

interface KnifeDaggerProps {
    size?: number;
    className?: string;
}

export const KnifeDagger: React.FC<KnifeDaggerProps> = ({
    size = 60,
    className = ''
}) => {
    const width = size * 0.32;
    const height = size;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
        >
            {/* Lame longue et fine */}
            <path
                d={`
                    M ${width * 0.5} 0
                    Q ${width * 0.7} ${height * 0.25}, ${width * 0.6} ${height * 0.7}
                    L ${width * 0.5} ${height * 0.8}
                    L ${width * 0.4} ${height * 0.7}
                    Q ${width * 0.3} ${height * 0.25}, ${width * 0.5} 0
                    Z
                `}
                fill="url(#daggerBladeGradient)"
                stroke="#B4A7FF"
                strokeWidth="1.5"
            />

            {/* Reflet */}
            <path
                d={`
                    M ${width * 0.5} ${height * 0.05}
                    Q ${width * 0.6} ${height * 0.3}, ${width * 0.55} ${height * 0.7}
                    L ${width * 0.5} ${height * 0.75}
                    Q ${width * 0.52} ${height * 0.4}, ${width * 0.5} ${height * 0.05}
                    Z
                `}
                fill="#fff"
                opacity="0.18"
            />

            {/* Garde argentée */}
            <ellipse
                cx={width * 0.5}
                cy={height * 0.8}
                rx={width * 0.18}
                ry={height * 0.035}
                fill="url(#daggerGuardGradient)"
                stroke="#B4A7FF"
                strokeWidth="1"
            />

            {/* Manche violet foncé */}
            <rect
                x={width * 0.42}
                y={height * 0.82}
                width={width * 0.16}
                height={height * 0.13}
                fill="url(#daggerHandleGradient)"
                stroke="#6C3FC5"
                strokeWidth="1"
                rx="3"
            />

            {/* Pommel */}
            <circle
                cx={width * 0.5}
                cy={height * 0.97}
                r={width * 0.06}
                fill="#B4A7FF"
                stroke="#6C3FC5"
                strokeWidth="1"
            />

            <defs>
                <linearGradient id="daggerBladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B4A7FF" />
                    <stop offset="60%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#6C3FC5" />
                </linearGradient>
                <linearGradient id="daggerGuardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B4A7FF" />
                    <stop offset="100%" stopColor="#fff" />
                </linearGradient>
                <linearGradient id="daggerHandleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C3FC5" />
                    <stop offset="100%" stopColor="#3B1F6B" />
                </linearGradient>
            </defs>
        </svg>
    );
};