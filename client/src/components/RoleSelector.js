import React from 'react';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/${role}`);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <Button variant="contained" color="primary" onClick={() => handleSelect('help-request')}>
          Hilfesuchender
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary" onClick={() => handleSelect('helper-dashboard')}>
          Helfender
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary" onClick={() => handleSelect('create-user')}>
          SignUp
        </Button>
      </Grid>
    </Grid>
  );
};
export default RoleSelector;
