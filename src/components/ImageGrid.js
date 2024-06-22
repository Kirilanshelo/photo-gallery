import React from 'react';
import { Grid, ImageList, ImageListItem } from '@mui/material';

const ImageGrid = ({ images, onImageClick, onImageLoad }) => {
    const handleImageLoad = (index, event) => {
        const { naturalWidth, naturalHeight } = event.target;
        onImageLoad(index, { width: naturalWidth, height: naturalHeight });
    };

    return (
        <Grid container spacing={2}>
            <ImageList cols={3} rowHeight={200}>
                {images.map((image, index) => (
                    <ImageListItem key={index} onClick={() => onImageClick(image)}>
                        <img 
                            src={image} 
                            alt={`image-${index}`} 
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onLoad={(event) => handleImageLoad(index, event)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Grid>
    );
};

export default ImageGrid;
