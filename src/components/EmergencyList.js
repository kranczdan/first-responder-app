import React from 'react';
import { List } from '@mui/material';
import EmergencyItem from './EmergencyItem';

const EmergencyList = ({ emergencies, onEmergencyClick, onRegisterAsHelper, onDeleteEmergency, selectedUser }) => {
  return (
    <List>
      {emergencies.map((emergency, index) => (
        <EmergencyItem
          key={index}
          emergency={emergency}
          onClick={() => onEmergencyClick(emergency)}
          onRegisterAsHelper={() => onRegisterAsHelper(emergency.id)}
          onDeleteEmergency={() => onDeleteEmergency(emergency.id)}
          selectedUser={selectedUser}
        />
      ))}
    </List>
  );
};

export default EmergencyList;
