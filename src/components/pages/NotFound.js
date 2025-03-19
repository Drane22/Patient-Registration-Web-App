import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Paper
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 500,
        mx: 'auto',
        mt: 5
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h4" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to="/"
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Paper>
  );
};

export default NotFound;