import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const SelectedEmergency = ({ emergency, selectedUser, onBackToList, onDeleteEmergency, onRegisterAsHelper, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      if (emergency) {
        const emergencyMarker = L.marker([emergency.eventLat, emergency.eventLong]).addTo(mapRef.current);
        const userMarker = L.marker([userLocation.latitude, userLocation.longitude]).addTo(mapRef.current);
        const bounds = L.latLngBounds([emergencyMarker.getLatLng(), userMarker.getLatLng()]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (userLocation.latitude && userLocation.longitude) {
        L.marker([userLocation.latitude, userLocation.longitude]).addTo(mapRef.current);
        mapRef.current.setView([userLocation.latitude, userLocation.longitude], 13);
      }
    }
  }, [emergency, userLocation]);

  return (
    <div>
      {emergency ? (
        <>
          <Typography variant="h6">Aktueller Notruf</Typography>
          <Typography>Latitude: {emergency.eventLat}</Typography>
          <Typography>Longitude: {emergency.eventLong}</Typography>
          <Typography>Notruftyp: {emergency.title}</Typography>
          <Typography>Beschreibung: {emergency.description}</Typography>
          <Typography>Opfer: {emergency.victimName}</Typography>
          <div><br></br></div>
        </>
      ) : (
        <Typography variant="h6">Kein Notruf ausgewählt. Dein Standort:</Typography>
      )}
      <MapContainer
        ref={mapRef}
        center={userLocation.latitude && userLocation.longitude ? [userLocation.latitude, userLocation.longitude] : [0, 0]}
        zoom={13}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {emergency && (
          <Marker position={[emergency.eventLat, emergency.eventLong]}>
            <Popup>Aktueller Notruf <br /> {emergency.title}</Popup>
          </Marker>
        )}
        {userLocation.latitude && userLocation.longitude && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Dein Standort</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default SelectedEmergency;
