import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CollectionSelector = ({ collections, selectedCollection, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel style={{ color: '#FFFFFF' }}>Collezione</InputLabel>
            <Select
                value={selectedCollection}
                onChange={onChange}
                label="Collezione"
                style={{ color: '#FFFFFF', backgroundColor: '#2C2C2C' }}
            >
                {Object.keys(collections).map((collection, index) => (
                    <MenuItem key={index} value={collection}>
                        {collection}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CollectionSelector;
