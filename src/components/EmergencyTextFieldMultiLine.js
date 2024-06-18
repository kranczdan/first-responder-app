import React from 'react';
import TextField from '@mui/material/TextField';

const EmergencyTextFieldMultiline = ({ label, value, onChange }) => (
    <TextField
      className="custom-textfield"
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      label={label}
      value={value}
      onChange={onChange}
    />
  );

export default EmergencyTextFieldMultiline;