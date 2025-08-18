import React from 'react';


interface AppleProps {
    size?: number;
    className?: string;
}


export const Apple: React.FC<AppleProps> = ({
    size = 30,
    className = ''
}) => {
    const width = size;
    const height = size * 1.1;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
        >
            {/* Apple body */}
            <path
                d={`M ${width * 0.5} ${height * 0.25}
           C ${width * 0.2} ${height * 0.25} ${width * 0.1} ${height * 0.5} ${width * 0.15} ${height * 0.8}
           C ${width * 0.2} ${height * 0.95} ${width * 0.4} ${height} ${width * 0.5} ${height * 0.95}
           C ${width * 0.6} ${height} ${width * 0.8} ${height * 0.95} ${width * 0.85} ${height * 0.8}
           C ${width * 0.9} ${height * 0.5} ${width * 0.8} ${height * 0.25} ${width * 0.5} ${height * 0.25}
           Z`}
                fill="url(#appleGradient)"
                stroke="#B22222"
                strokeWidth="1"
            />

            {/* Apple highlight */}
            <ellipse
                cx={width * 0.4}
                cy={height * 0.45}
                rx={width * 0.15}
                ry={height * 0.2}
                fill="#FF6B6B"
                opacity="0.7"
            />

            {/* Apple shine */}
            <ellipse
                cx={width * 0.35}
                cy={height * 0.4}
                rx={width * 0.08}
                ry={height * 0.12}
                fill="#FFFFFF"
                opacity="0.8"
            />

            {/* Stem */}
            <rect
                x={width * 0.48}
                y={height * 0.15}
                width={width * 0.04}
                height={height * 0.12}
                fill="#8B4513"
                rx="1"
            />

            {/* Leaf */}
            <path
                d={`M ${width * 0.52} ${height * 0.2}
           C ${width * 0.65} ${height * 0.15} ${width * 0.7} ${height * 0.25} ${width * 0.6} ${height * 0.28}
           C ${width * 0.55} ${height * 0.25} ${width * 0.52} ${height * 0.2} ${width * 0.52} ${height * 0.2}
           Z`}
                fill="url(#leafGradient)"
                stroke="#228B22"
                strokeWidth="0.5"
            />

            {/* Leaf vein */}
            <path
                d={`M ${width * 0.55} ${height * 0.22} L ${width * 0.62} ${height * 0.26}`}
                stroke="#006400"
                strokeWidth="0.5"
                fill="none"
            />

            {/* Gradients */}
            <defs>
                <radialGradient id="appleGradient" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#FF4444" />
                    <stop offset="70%" stopColor="#DC143C" />
                    <stop offset="100%" stopColor="#B22222" />
                </radialGradient>

                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#32CD32" />
                    <stop offset="50%" stopColor="#228B22" />
                    <stop offset="100%" stopColor="#006400" />
                </linearGradient>
            </defs>
        </svg>
    );
};

