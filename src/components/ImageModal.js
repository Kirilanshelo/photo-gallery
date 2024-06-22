import React from 'react';
import { Modal, Box } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: '#2C2C2C',
    boxShadow: 24,
    p: 4,
    color: '#FFFFFF',
    maxWidth: '90vw',
    maxHeight: '90vh'
};

const ImageModal = ({ open, image, handleClose, dimensions }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <img 
                    src={image} 
                    alt="selected" 
                    style={{ 
                        width: dimensions?.width > dimensions?.height ? '100%' : 'auto', 
                        height: dimensions?.height > dimensions?.width ? '100%' : 'auto', 
                        objectFit: 'contain',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto'
                    }} 
                />
            </Box>
        </Modal>
    );
};

export default ImageModal;
