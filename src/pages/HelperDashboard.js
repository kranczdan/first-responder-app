import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import GPSDisplay from '../components/GPSDisplay';
import '../styles/HelperDashboard.css';
import EmergencyList from '../components/EmergencyList';
import SelectedEmergency from '../components/SelectedEmergency';
import UserSelector from '../components/UserSelector';
import HomeButton from '../components/HomeButton';

const HelperDashboard = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [emergencies, setEmergencies] = useState([]);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    fetchEmergencies();
    fetchUsers();
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('wss://34.224.26.26:3001');

    ws.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      console.log("gibts was neues? ", parsedMessage);

      if (parsedMessage.topic === 'emergency-call') {
        await fetchEmergencies();
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch('/api/event');
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Notrufe.');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEmergencies(sortedData);
    } catch (error) {
      console.error('Fehler beim Abrufen der Notrufe:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Benutzer.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
    }
  };

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error obtaining location', error);
      }
    );
  };

  const handleEmergencyClick = (emergency) => {
    setSelectedEmergency(emergency);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleBackToList = () => {
    setSelectedEmergency(null);
  };

  const handleDeleteEmergency = async (emergencyId) => {
    try {
      const response = await fetch(`/api/event/${emergencyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Notrufs.');
      }
      setEmergencies((prevEmergencies) => prevEmergencies.filter((emergency) => emergency.id !== emergencyId));
      if (selectedEmergency && selectedEmergency.id === emergencyId) {
        setSelectedEmergency(null);
      }
      alert('Notruf erfolgreich gelöscht!');
    } catch (error) {
      console.error('Fehler beim Löschen des Notrufs:', error);
      alert('Fehler beim Löschen des Notrufs.');
    }
  };

  const sendMessageToEmergencyResponse = async (messagePayload) => {
    try {
      const response = await fetch('/api/event/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        console.log('Message sent to emergency-response topic:', messagePayload);
      } else {
        throw new Error('Fehler beim Senden der Nachricht an das emergency-response Topic.');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht an das emergency-response Topic:', error);
    }
  };

  const handleRegisterAsHelper = async (eventId) => {
    try {
      /*
      const selectedUserData = users.find((user) => user.id === selectedUser);
      const userLong = selectedUserData?.longitude || 47.837651; // Fallback oder echte Daten verwenden
      const userLat = selectedUserData?.latitude || 16.527894; // Fallback oder echte Daten verwenden
       */

      await sendMessageToEmergencyResponse({
        userLong: "" + userLocation.longitude,
        userLat: "" + userLocation.latitude,
        eventId: eventId,
        userId: selectedUser,
      });

      alert('Erfolgreich als Ersthelfer registriert!');
    } catch (error) {
      console.error('Fehler bei der Registrierung als Ersthelfer:', error);
      alert('Fehler bei der Registrierung.');
    }
  };

  return (
    <Container>
      <div><br></br></div>
      <Typography variant="h4" gutterBottom>
        Helfer-Dashboard
      </Typography>
      <GPSDisplay />
      <div><br></br></div>
      <UserSelector users={users} selectedUser={selectedUser} onUserChange={handleUserChange} />
      {selectedEmergency ? (
        <SelectedEmergency
          emergency={selectedEmergency}
          selectedUser={selectedUser}
          onBackToList={handleBackToList}
          onDeleteEmergency={handleDeleteEmergency}
          userLocation={userLocation}
        />
      ) : (
        <Typography variant="h6" style={{ marginTop: '16px' }}>
          Wählen Sie einen Notruf aus der Liste aus.
        </Typography>
      )}
      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Alle Notrufe
      </Typography>
      <EmergencyList
        emergencies={emergencies}
        selectedUser={selectedUser}
        onEmergencyClick={handleEmergencyClick}
        onRegisterAsHelper={handleRegisterAsHelper}
        onDeleteEmergency={handleDeleteEmergency}
      /><div><br></br></div>
      <div>
        <HomeButton />
        <div><br></br></div>
      </div>
    </Container>
  );
};

export default HelperDashboard;
