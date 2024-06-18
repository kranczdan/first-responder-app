import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

const GPSDisplay = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error obtaining location', error);
      }
    );
  }, []);

  return (
    <div>
      <Typography variant="body1">My Latitude: {location.latitude}</Typography>
      <Typography variant="body1">My Longitude: {location.longitude}</Typography>
    </div>
  );
};

export default GPSDisplay;
