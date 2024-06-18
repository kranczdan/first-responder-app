import React from 'react';
import Button from '@mui/material/Button';

const EmergencyButton = ({ onClick, label }) => {
  return (
    <Button variant="contained" color="primary" fullWidth onClick={onClick}>
      {label}
    </Button>
  );
};

export default EmergencyButton;
