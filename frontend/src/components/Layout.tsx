import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout: React.FC = () => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar />
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        minHeight: '100vh',
      }}
    >
      <Toolbar />
      <Outlet />
    </Box>
  </Box>
);

export default Layout; 