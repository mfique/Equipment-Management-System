import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Logo from '../assets/react.svg';

const Topbar: React.FC = () => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(90deg, #1976d2 0%, #dc004e 100%)' }}>
    <Toolbar>
      <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
      <Typography variant="h6" noWrap component="div">
        Equipment Management System
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Topbar; 