import React from 'react';
import TextField from '@mui/material/TextField';

const CustomTextField = ({ label, value, onChange }) => (
  <TextField
    className="custom-textfield"
    variant="outlined"
    fullWidth
    required
    label={label}
    value={value}
    onChange={onChange}
  />
);

export default CustomTextField;
