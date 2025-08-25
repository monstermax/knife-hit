import React from 'react';


interface WoodTargetProps {
    size?: number;
    className?: string;
}


export const WoodTarget: React.FC<WoodTargetProps> = ({
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
            {/* Outer bark ring */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="3"
            />

            {/* Wood rings from outside to inside - with irregularities */}
            <path
                d={`M ${center + radius * 0.9} ${center} 
           A ${radius * 0.9} ${radius * 0.88} 0 0 1 ${center - radius * 0.92} ${center}
           A ${radius * 0.91} ${radius * 0.9} 0 0 1 ${center + radius * 0.9} ${center} Z`}
                fill="#D2B48C"
                stroke="#CD853F"
                strokeWidth="2"
            />

            <path
                d={`M ${center + radius * 0.75} ${center} 
           A ${radius * 0.75} ${radius * 0.73} 0 0 1 ${center - radius * 0.77} ${center}
           A ${radius * 0.76} ${radius * 0.75} 0 0 1 ${center + radius * 0.75} ${center} Z`}
                fill="#F5DEB3"
                stroke="#DEB887"
                strokeWidth="2"
            />

            <path
                d={`M ${center + radius * 0.6} ${center} 
           A ${radius * 0.6} ${radius * 0.58} 0 0 1 ${center - radius * 0.62} ${center}
           A ${radius * 0.61} ${radius * 0.6} 0 0 1 ${center + radius * 0.6} ${center} Z`}
                fill="#D2B48C"
                stroke="#CD853F"
                strokeWidth="2"
            />

            <path
                d={`M ${center + radius * 0.45} ${center} 
           A ${radius * 0.45} ${radius * 0.43} 0 0 1 ${center - radius * 0.47} ${center}
           A ${radius * 0.46} ${radius * 0.45} 0 0 1 ${center + radius * 0.45} ${center} Z`}
                fill="#F5DEB3"
                stroke="#DEB887"
                strokeWidth="2"
            />

            <path
                d={`M ${center + radius * 0.3} ${center} 
           A ${radius * 0.3} ${radius * 0.28} 0 0 1 ${center - radius * 0.32} ${center}
           A ${radius * 0.31} ${radius * 0.3} 0 0 1 ${center + radius * 0.3} ${center} Z`}
                fill="#D2B48C"
                stroke="#CD853F"
                strokeWidth="2"
            />

            <path
                d={`M ${center + radius * 0.15} ${center} 
           A ${radius * 0.15} ${radius * 0.13} 0 0 1 ${center - radius * 0.17} ${center}
           A ${radius * 0.16} ${radius * 0.15} 0 0 1 ${center + radius * 0.15} ${center} Z`}
                fill="#F5DEB3"
                stroke="#DEB887"
                strokeWidth="2"
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

            {/* Wood grain lines */}
            <g opacity="0.3">
                <path
                    d={`M ${center - radius * 0.8} ${center - radius * 0.2} Q ${center} ${center - radius * 0.1} ${center + radius * 0.8} ${center - radius * 0.2}`}
                    stroke="#8B4513"
                    strokeWidth="1"
                    fill="none"
                />
                <path
                    d={`M ${center - radius * 0.7} ${center + radius * 0.1} Q ${center} ${center + radius * 0.2} ${center + radius * 0.7} ${center + radius * 0.1}`}
                    stroke="#8B4513"
                    strokeWidth="1"
                    fill="none"
                />
                <path
                    d={`M ${center - radius * 0.6} ${center - radius * 0.4} Q ${center} ${center - radius * 0.3} ${center + radius * 0.6} ${center - radius * 0.4}`}
                    stroke="#8B4513"
                    strokeWidth="1"
                    fill="none"
                />
            </g>
        </svg>
    );
};

