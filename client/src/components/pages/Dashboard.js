import React from 'react';
import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Registration System
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        A web application for managing patient information. Built with React, Node.js, Express, and MySQL.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              borderTop: '4px solid #1976d2',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAddIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h6">Register New Patient</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Add a new patient to the system with all their personal and medical information.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/patients/new"
              startIcon={<PersonAddIcon />}
              fullWidth
            >
              Register Patient
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              borderTop: '4px solid #2e7d32',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ color: '#2e7d32', fontSize: 28, mr: 1 }} />
              <Typography variant="h6">View All Patients</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Browse, search, and manage all registered patients in the system.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/patients"
              startIcon={<PeopleIcon />}
              fullWidth
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              View Patients
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              borderTop: '4px solid #ed6c02',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DeleteIcon sx={{ color: '#ed6c02', fontSize: 28, mr: 1 }} />
              <Typography variant="h6">Deleted Patients</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              View and restore patient data that have been deleted from the system.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/patients/deleted"
              startIcon={<DeleteIcon />}
              fullWidth
              sx={{ bgcolor: '#ed6c02', '&:hover': { bgcolor: '#e65100' } }}
            >
              View Deleted
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
