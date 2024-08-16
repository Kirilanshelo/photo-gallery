import React from 'react';
import { Grid, ImageList, ImageListItem } from '@mui/material';

const ImageGrid = ({ images, onImageClick, onImageLoad }) => {
    const handleImageLoad = (index, event) => {
        const { naturalWidth, naturalHeight } = event.target;
        onImageLoad(index, { width: naturalWidth, height: naturalHeight });
    };

    const isVideo = (file) => {
        const videoExtensions = ['mp4', 'webm', 'ogg'];
        const extension = file.split('.').pop().toLowerCase();
        return videoExtensions.includes(extension);
    };

    return (
        <Grid container spacing={2}>
            <ImageList cols={3} rowHeight={200}>
                {images.map((file, index) => (
                    <ImageListItem key={index} onClick={() => onImageClick(file)}>
                        {isVideo(file) ? (
                            <video 
                                src={file} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onLoadedMetadata={(event) => handleImageLoad(index, event)}
                            />
                        ) : (
                            <img 
                                src={file} 
                                alt={`file-${index}`} 
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onLoad={(event) => handleImageLoad(index, event)}
                            />
                        )}
                    </ImageListItem>
                ))}
            </ImageList>
        </Grid>
    );
};

export default ImageGrid;
