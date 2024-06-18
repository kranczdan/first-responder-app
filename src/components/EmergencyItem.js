import React from 'react';
import { ListItem, ListItemText, Button } from '@mui/material';

const EmergencyItem = ({ emergency, onClick, onRegisterAsHelper, onDeleteEmergency, selectedUser }) => {
  return (
    <ListItem button onClick={() => onClick(emergency)}>
      <ListItemText primary={emergency.title} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => onRegisterAsHelper(emergency.id)}
        disabled={!selectedUser}
        style={{ marginTop: '16px', marginRight: '8px' }}
      >
        Als Ersthelfer melden
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onDeleteEmergency(emergency.id)}
        style={{ marginTop: '16px' }}
      >
        Löschen
      </Button>
    </ListItem>
  );
};

export default EmergencyItem;
