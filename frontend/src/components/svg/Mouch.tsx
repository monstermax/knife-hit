import React from 'react';


interface MouchProps {
    size?: number;
    className?: string;
}


export const Mouch: React.FC<MouchProps> = ({
    size = 30,
    className = ''
}) => {
    const width = size;
    const height = size * 1.1;

    return (
        <img src="/images/mouch.png" style={{ width: `${width}px`, height: `${height}px`, margin: 'auto' }} />
    );

};

