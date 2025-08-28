import React from 'react';


interface MemeImageProps {
    memeType: MemeType;
    size?: number;
    className?: string;
}

type MemeType = 'john' | 'mouch' | 'bill' | 'port' | 'pepe' | 'keone';


export const MemeImage: React.FC<MemeImageProps> = ({
    memeType,
    size = 30,
    className = ''
}) => {
    const width = size;
    const height = size * 1.1;

    let filename = '';

    switch (memeType) {
        case 'john':
            filename = 'JohnWRichKid.png';
            break;
        case 'mouch':
            filename = 'mouch.png';
            break;
        case 'bill':
            filename = 'bill.jpg';
            break;
        case 'port':
            filename = 'port.png';
            break;
        case 'pepe':
            filename = 'pepe.png';
            break;
        case 'keone':
            filename = 'keone.png';
            break;
    }

    return (
        <img
            src={`/images/${filename}`}
            className={className}
            style={{ width: `${width}px`, height: `${height}px`, margin: 'auto' }}
            />
    );

};

