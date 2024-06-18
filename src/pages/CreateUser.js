import React, { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton'
import '../styles/CreateUser.css';
import HomeButton from '../components/HomeButton';

const CreateUser = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://34.224.26.26:8090/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname }),
      });

      if (response.ok) {
        alert('Benutzer erfolgreich angelegt!');
      } else {
        console.error('Fehler beim Anlegen des Benutzers:', response.statusText);
        alert('Fehler beim Anlegen des Benutzers.');
      }
    } catch (error) {
      console.error('Fehler beim Anlegen des Benutzers:', error);
      alert('Fehler beim Anlegen des Benutzers.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography component="h1" variant="h5">
          Benutzer anlegen
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField label="Vorname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField label="Nachname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </Grid>
          </Grid>
          <CustomButton type="submit" label="Benutzer anlegen" />
          <HomeButton />
        </form>
      </div>
    </Container>
  );
};

export default CreateUser;
