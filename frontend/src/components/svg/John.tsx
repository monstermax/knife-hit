import React from 'react';


interface JohnProps {
    size?: number;
    className?: string;
}


export const John: React.FC<JohnProps> = ({
    size = 30,
    className = ''
}) => {
    const width = size;
    const height = size * 1.1;

    return (
        <img src="/images/JohnWRichKid.png" style={{ width: `${width}px`, height: `${height}px`, margin: 'auto' }} />
    );

};

