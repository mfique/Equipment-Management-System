import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h1" color="primary" gutterBottom>404</Typography>
      <Typography variant="h4" gutterBottom>Page Not Found</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Sorry, the page you are looking for does not exist.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </Box>
  );
};

export default NotFound; 