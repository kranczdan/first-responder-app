import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const HomeButton = ({ type, label, onClick }) => (
    <Button
        component={Link}
        to="/"
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
    >
        Zurück zum Hauptmenü
    </Button>
);

export default HomeButton;