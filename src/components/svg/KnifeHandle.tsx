import React from 'react';

interface KnifeHandleProps {
  size?: number;
  className?: string;
  rotation?: number;
}

export const KnifeHandle: React.FC<KnifeHandleProps> = ({ 
  size = 60, 
  className = '',
  rotation = 0
}) => {
  const width = size * 0.3;
  const height = size * 0.4; // Only handle portion

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Guard */}
      <rect
        x={width * 0.2}
        y={0}
        width={width * 0.6}
        height={height * 0.1}
        fill="#8B4513"
        rx="2"
      />
      
      {/* Handle */}
      <rect
        x={width * 0.35}
        y={height * 0.1}
        width={width * 0.3}
        height={height * 0.75}
        fill="url(#handleGradient)"
        stroke="#654321"
        strokeWidth="1"
        rx="3"
      />
      
      {/* Handle wrapping lines */}
      <g stroke="#654321" strokeWidth="1" opacity="0.7">
        <line x1={width * 0.35} y1={height * 0.2} x2={width * 0.65} y2={height * 0.2} />
        <line x1={width * 0.35} y1={height * 0.3} x2={width * 0.65} y2={height * 0.3} />
        <line x1={width * 0.35} y1={height * 0.4} x2={width * 0.65} y2={height * 0.4} />
        <line x1={width * 0.35} y1={height * 0.5} x2={width * 0.65} y2={height * 0.5} />
        <line x1={width * 0.35} y1={height * 0.6} x2={width * 0.65} y2={height * 0.6} />
        <line x1={width * 0.35} y1={height * 0.7} x2={width * 0.65} y2={height * 0.7} />
      </g>
      
      {/* Pommel */}
      <circle
        cx={width * 0.5}
        cy={height * 0.9}
        r={width * 0.08}
        fill="#A0A0A0"
        stroke="#808080"
        strokeWidth="1"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CD853F" />
          <stop offset="50%" stopColor="#D2691E" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

