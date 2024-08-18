import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LazyImage = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);

    const handleImageLoad = () => {
        setLoaded(true);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {!loaded && (
              <div 
              style={{ 
                top: '50%', 
                left: '50%', 
                width: '15vw', 
                height: '5vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                objectFit: 'contain',
                backgroundColor: '#f0f0f0' // colore di sfondo per simulare il rettangolo
              }}
              >
                  <CircularProgress thickness={5}/>
              </div>
            )}
            <img 
                src={src} 
                alt={alt} 
                onLoad={handleImageLoad} 
                style={{ display: loaded ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
};

export default LazyImage;