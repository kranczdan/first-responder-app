import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../styles/HelpRequest.css';

const EmergencyTypeSelector = ({ onSelect }) => {
  const [emergencyType, setEmergencyType] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setEmergencyType(value);
    onSelect(value);
  };

  return (
    <FormControl fullWidth style={{ marginBottom: '16px' }} className="dropdown-primary-border dropdown-white-text dropdown-white-label">
      <InputLabel id="emergency-type-label" className="dropdown-white-label">Art der Hilfe</InputLabel>
      <Select
        labelId="emergency-type-label"
        id="emergency-type"
        value={emergencyType}
        label="Art der Hilfe"
        onChange={handleChange}
        className="dropdown-white-text"
      >
        <MenuItem value="Feuer">Feuer</MenuItem>
        <MenuItem value="Unfall">Unfall</MenuItem>
        <MenuItem value="Medizinisch">Medizinisch</MenuItem>
      </Select>
    </FormControl>
  );
};

export default EmergencyTypeSelector;
