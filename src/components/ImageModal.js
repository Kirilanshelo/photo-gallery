import React from 'react';
import { Modal, Box } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '90vw',
    // height: '90vh',
    bgcolor: '#2C2C2C',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 600px)': {
        // width: '100vw',
        // height: '100vh',
        p: 2,
    },
};

const ImageModal = ({ open, image, handleClose, dimensions }) => {
    const isImage = (file) => {
        if (file !== undefined) {
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const extension = file.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension);
        }
        return false
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {isImage(image) ? (
                    <img 
                        src={image} 
                        alt="selected" 
                        style={{ 
                            // width: dimensions?.width > dimensions?.height ? '100%' : 'auto', 
                            // height: dimensions?.height > dimensions?.width ? '100%' : 'auto', 
                            objectFit: 'contain',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            margin: 'auto'
                        }} 
                    />
                ) : (
                    <video 
                        src={image} 
                        controls 
                        style={{ 
                            width: dimensions?.width > dimensions?.height ? '100%' : 'auto', 
                            height: dimensions?.height > dimensions?.width ? '100%' : 'auto', 
                            objectFit: 'contain',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            margin: 'auto'
                        }} 
                    />
                )}
            </Box>
        </Modal>
    );
};

export default ImageModal;
