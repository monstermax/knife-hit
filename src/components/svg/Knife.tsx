import React from 'react';

interface KnifeProps {
  size?: number;
  className?: string;
  rotation?: number;
}

export const Knife: React.FC<KnifeProps> = ({ 
  size = 60, 
  className = '',
  rotation = 0
}) => {
  const width = size * 0.3;
  const height = size;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Blade */}
      <path
        d={`M ${width * 0.5} 0 
           L ${width * 0.7} ${height * 0.6}
           L ${width * 0.5} ${height * 0.65}
           L ${width * 0.3} ${height * 0.6}
           Z`}
        fill="url(#bladeGradient)"
        stroke="#A0A0A0"
        strokeWidth="1"
      />
      
      {/* Blade highlight */}
      <path
        d={`M ${width * 0.5} 2 
           L ${width * 0.55} ${height * 0.6}
           L ${width * 0.5} ${height * 0.63}
           Z`}
        fill="#FFFFFF"
        opacity="0.6"
      />
      
      {/* Guard */}
      <rect
        x={width * 0.2}
        y={height * 0.6}
        width={width * 0.6}
        height={height * 0.05}
        fill="#8B4513"
        rx="2"
      />
      
      {/* Handle */}
      <rect
        x={width * 0.35}
        y={height * 0.65}
        width={width * 0.3}
        height={height * 0.3}
        fill="url(#handleGradient)"
        stroke="#654321"
        strokeWidth="1"
        rx="3"
      />
      
      {/* Handle wrapping lines */}
      <g stroke="#654321" strokeWidth="1" opacity="0.7">
        <line x1={width * 0.35} y1={height * 0.7} x2={width * 0.65} y2={height * 0.7} />
        <line x1={width * 0.35} y1={height * 0.75} x2={width * 0.65} y2={height * 0.75} />
        <line x1={width * 0.35} y1={height * 0.8} x2={width * 0.65} y2={height * 0.8} />
        <line x1={width * 0.35} y1={height * 0.85} x2={width * 0.65} y2={height * 0.85} />
        <line x1={width * 0.35} y1={height * 0.9} x2={width * 0.65} y2={height * 0.9} />
      </g>
      
      {/* Pommel */}
      <circle
        cx={width * 0.5}
        cy={height * 0.97}
        r={width * 0.08}
        fill="#A0A0A0"
        stroke="#808080"
        strokeWidth="1"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="50%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
        
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CD853F" />
          <stop offset="50%" stopColor="#D2691E" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

