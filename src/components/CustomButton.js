import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ type, label, onClick }) => (
  <Button
    className="custom-button"
    type={type}
    fullWidth
    variant="contained"
    onClick={onClick}
    sx={{ mt: 3, mb: 2 }}
  >
    {label}
  </Button>
);

export default CustomButton;
