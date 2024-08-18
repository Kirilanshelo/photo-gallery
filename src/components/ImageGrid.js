import React from 'react';
import { Grid, ImageList, ImageListItem } from '@mui/material';
import LazyVideo from './LazyVideo';
import LazyImage from './LazyImg';

const ImageGrid = React.memo(({ images, onImageClick, onImageLoad }) => {
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
        <Grid container item spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <ImageList variant="masonry" cols={3}>
                {images.map((file, index) => (
                    <ImageListItem key={index} onClick={() => onImageClick(file)}>
                        {isVideo(file) ? (
                            <LazyVideo file={file} index={index} handleImageLoad={handleImageLoad} /> 
                        ) : (
                            <LazyImage src={file} alt={`file-${index}`} />
                        )}
                    </ImageListItem>
                ))}
            </ImageList>
        </Grid>
    );
});

export default ImageGrid;
