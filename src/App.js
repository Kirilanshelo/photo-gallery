import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { collections, generateImagePaths } from './data';
import CollectionSelector from './components/CollectionSelector';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';

const App = () => {
    const [selectedCollection, setSelectedCollection] = useState(Object.keys(collections)[0]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({});

    const handleCollectionChange = (event) => {
        setSelectedCollection(event.target.value);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleImageLoad = (index, dimensions) => {
        setImageDimensions((prevDimensions) => ({
            ...prevDimensions,
            [index]: dimensions
        }));
    };

    return (
        <Container style={{          
            backgroundColor: '#1C1C1C', 
            // minHeight: '100vh', 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' }}>
            <Typography variant="h1" style={{ color: '#FFFFFF', textAlign: 'center' }}>Galleria Fotografica</Typography>
            <CollectionSelector
                collections={collections}
                selectedCollection={selectedCollection}
                onChange={handleCollectionChange}
            />
            <ImageGrid
                images={generateImagePaths(selectedCollection)}
                onImageClick={handleImageClick}
                onImageLoad={handleImageLoad}
            />
            {selectedImage && (
                <ImageModal
                    open={!!selectedImage}
                    image={selectedImage}
                    handleClose={handleCloseModal}
                    dimensions={imageDimensions[generateImagePaths(selectedCollection).indexOf(selectedImage)]}
                />
            )}
        </Container>
    );
};

export default App;
