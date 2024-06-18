import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" >
        First Responder App
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
