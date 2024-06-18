import React, { useState, useEffect } from 'react';
import { Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GPSDisplay from '../components/GPSDisplay';
import EmergencyButton from '../components/EmergencyButton';
import EmergencyTypeSelector from '../components/EmergencyTypeSelector';
import '../styles/HelpRequest.css';
import EmergencyTextField from '../components/EmergencyTextField';
import EmergencyTextFieldMultiline from '../components/EmergencyTextFieldMultiLine';
import HomeButton from '../components/HomeButton';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HelpRequest = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [victimName, setVictimName] = useState('');
  const [description, setDescription] = useState('');
  const [eventData, setEventData] = useState(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [eventCoordinates, setEventCoordinates] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [eventType, setEventType] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://34.224.26.26:29092');

    ws.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      console.log("gibts was neues emergency-response? ", parsedMessage);

      // Überprüfen des Topic-Namens
      if (parsedMessage.topic === 'emergency-response') {
        setEventType(parsedMessage.type);
        const parsedDto = JSON.parse(parsedMessage.value);
        if (eventId === parsedDto.eventId) {
          await handleFetchEventDetails(eventId); // Fetch updated emergencies on message received
        }
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
  }, [eventId]);

  const handleFetchEventDetails = async (eventId) => {
    try {
      const response = await fetch(`/api/event/${eventId}`);
      if (response.ok) {
        const eventData = await response.json();
        setEventData(eventData);
      } else {
        console.error('Fehler beim Abrufen der Event-Daten:', response.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Event-Daten:', error);
    }
  };

  const handleEmergency = async () => {
    if (!emergencyType) {
      alert('Bitte wählen Sie eine Art der Hilfe aus.');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setIsWaitingForResponse(true);
      setEventCoordinates([position.coords.latitude, position.coords.longitude]);

      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventLat: position.coords.latitude,
          eventLong: position.coords.longitude,
          title: emergencyType,
          description: description || '---',
          victimName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const eventId = responseData.id; // Save the event ID received from the server
        setEventId(eventId); // Save the event ID in state
        handleFetchEventDetails(eventId); // Fetch event details using the received event ID
        alert('Notruf erfolgreich gesendet!');
      } else {
        console.error('Fehler beim Senden des Notrufs:', response.statusText);
        alert('Fehler beim Senden des Notrufs.');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Position oder beim Senden des Notrufs:', error);
      alert('Fehler beim Senden des Notrufs.');
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <Container className="help-request-container">
      <Typography variant="h4" gutterBottom>Hilferuf</Typography>
      <GPSDisplay />
      <div><br></br></div>
      <EmergencyTypeSelector onSelect={setEmergencyType} />
      <EmergencyTextField
        label="Name des Opfers"
        value={victimName}
        onChange={(e) => setVictimName(e.target.value)}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <div><br></br></div>
      <EmergencyTextFieldMultiline
        label="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <div><br></br></div>
      <EmergencyButton onClick={handleEmergency} label="Notruf auslösen" />
      <div><br></br></div>

      {eventCoordinates && (
        <MapContainer
          center={eventCoordinates}
          zoom={13}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={eventCoordinates}>
            <Popup>
              Notruf abgesetzt. Warte auf Hilfe.
            </Popup>
          </Marker>
          {eventData && eventData.userToEventDtos && eventData.userToEventDtos.map((userEvent) => (
            <Marker key={userEvent.id} position={[userEvent.userLat, userEvent.userLong]}>
              <Popup>
                Helfer: {userEvent.user.firstname} {userEvent.user.lastname} <br />
                Entfernung: {userEvent.distance.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {eventData && (
        <div className="event-details-container">
          <Typography variant="h6">Ereignisdetails</Typography>
          <Typography><strong>Opfer:</strong> {eventData.victimName}</Typography>
          <Typography><strong>Beschreibung:</strong> {eventData.description}</Typography>
          {eventData.assignedUser && (
            <Typography><strong>Zugewiesener Helfer:</strong> {eventData.user.firstname} {eventData.user.lastname}</Typography>
          )}
          <Typography><strong>Gemeldete Helfer:</strong></Typography>
          <List>
            {eventData.userToEventDtos?.map((userEvent) => (
              <ListItem key={userEvent.id}>
                <ListItemText primary={`${userEvent.user.firstname} ${userEvent.user.lastname}`} secondary={`Entfernung: ${userEvent.distance.toFixed(2)} km`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}

      {isWaitingForResponse && (
        <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>
          Notruf abgesetzt. Warte auf Hilfe.
        </Typography>
      )}

      {eventType === 'help-response' && eventData && (
        <Container className="help-response-details">
          <Typography variant="h5" gutterBottom>Notrufannahme</Typography>
          <Typography><strong>Opfer:</strong> {eventData.victimName}</Typography>
          <Typography><strong>Beschreibung:</strong> {eventData.description}</Typography>
          {eventData.assignedUser && (
            <Typography><strong>Zugewiesener Helfer:</strong> {eventData.assignedUser.firstname} {eventData.assignedUser.lastname}</Typography>
          )}
          <Typography><strong>Helfer:</strong></Typography>
          <List>
            {eventData.userToEventDtos?.map((userEvent) => (
              <ListItem key={userEvent.id}>
                <ListItemText primary={`${userEvent.user.firstname} ${userEvent.user.lastname}`} secondary={`Entfernung: ${userEvent.distance.toFixed(2)} km`} />
              </ListItem>
            ))}
          </List>
        </Container>
      )}
      <div><br></br></div>
      <HomeButton />
      <div><br></br></div>
    </Container>
  );

};

export default HelpRequest;
