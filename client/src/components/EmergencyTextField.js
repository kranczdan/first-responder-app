import React from 'react';
import TextField from '@mui/material/TextField';

const EmergencyTextField = ({ label, value, onChange }) => (
  <TextField
    className="custom-textfield"
    variant="outlined"
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
  />
);
export default EmergencyTextField;


