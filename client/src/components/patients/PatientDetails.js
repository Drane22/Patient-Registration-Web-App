import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/api/patients/${id}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        setPatient(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        if (err.response) {
          const errorMsg = err.response.data?.msg || 'Server returned an error';
          setError(`Failed to fetch patient details: ${errorMsg}`);
          toast.error(`Failed to fetch patient details: ${errorMsg}`);
        } else if (err.request) {
          setError('Failed to fetch patient details: No response received from server');
          toast.error('Failed to fetch patient details: No response received from server');
        } else {
          setError('Failed to fetch patient details: Request failed');
          toast.error('Failed to fetch patient details: Request failed');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient data?')) {
      try {
        await axios.delete(`/api/patients/${id}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        toast.success('Patient deleted successfully');
        navigate('/patients');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete patient');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error || 'Patient not found'}
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/patients"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Patients
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/patients"
          startIcon={<ArrowBackIcon />}
        >
          Back to Patients
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Patient Details
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to={`/patients/${id}/edit`}
          startIcon={<EditIcon />}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        {/* Personal Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">
                {patient.firstName} {patient.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">{patient.gender}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{patient.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{patient.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Check-in Time
              </Typography>
              <Typography variant="body1">
                {patient.checkInTime ? format(new Date(patient.checkInTime), 'MMMM dd, yyyy h:mm a') : 'Not available'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Address Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Address Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">{patient.address}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                City
              </Typography>
              <Typography variant="body1">{patient.city}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                State
              </Typography>
              <Typography variant="body1">{patient.state}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Zip Code
              </Typography>
              <Typography variant="body1">{patient.zipCode}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Emergency Contact */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Emergency Contact
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {patient.emergencyContactName || 'Not provided'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {patient.emergencyContactPhone || 'Not provided'}
              </Typography>
            </Grid>
          </Grid>
        </Box>


      </Paper>
    </Box>
  );
};

export default PatientDetails;
