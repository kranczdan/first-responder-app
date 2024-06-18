import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UserSelector = ({ users, selectedUser, onUserChange }) => {
  return (
    <FormControl fullWidth style={{ marginBottom: '16px' }} className="dropdown-primary-border dropdown-white-text dropdown-white-label">
      <InputLabel id="user-select-label" className="dropdown-white-label">Ersthelfer auswählen</InputLabel>
      <Select
        labelId="user-select-label"
        id="user-select"
        value={selectedUser}
        label="Ersthelfer auswählen"
        onChange={onUserChange}
        className="dropdown-white-text"
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id} className="dropdown-white-text">
            {user.firstname} {user.lastname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserSelector;
