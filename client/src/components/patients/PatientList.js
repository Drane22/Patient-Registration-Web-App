import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckInButton from './CheckInButton';
import { format } from 'date-fns';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  // Fetch patients on component mount and when search/page changes
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        // Add custom header to indicate we'll handle errors locally
        const res = await axios.get(`/api/patients?page=${page}&search=${search}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        setPatients(res.data.patients);
        setTotalPages(res.data.totalPages);
        setTotalPatients(res.data.totalPatients);
      } catch (err) {
        // More specific error handling
        if (err.response) {
          const errorMsg = err.response.data?.msg || 'Server returned an error';
          toast.error(`Failed to fetch patients: ${errorMsg}`);
        } else if (err.request) {
          toast.error('Failed to fetch patients: No response received from server');
        } else {
          toast.error('Failed to fetch patients: Request failed');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle patient deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient data?')) {
      try {
        // Add custom header to indicate we'll handle errors locally
        await axios.delete(`/api/patients/${id}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        toast.success('Patient deleted successfully');
        // Refresh patient list
        const res = await axios.get(`/api/patients?page=${page}&search=${search}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        setPatients(res.data.patients);
        setTotalPages(res.data.totalPages);
        setTotalPatients(res.data.totalPatients);
      } catch (err) {
        toast.error('Failed to delete patient');
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Patients
          {totalPatients > 0 && (
            <Chip 
              label={`${totalPatients} total`} 
              size="small" 
              sx={{ ml: 2, bgcolor: 'primary.light', color: 'white' }} 
            />
          )}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : patients.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No patients found
            </Typography>
            {search && (
              <Button 
                variant="text" 
                onClick={() => setSearch('')}
                sx={{ mt: 2 }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            component={RouterLink}
                            to={`/patients/${patient.id}`}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Patient">
                          <IconButton
                            component={RouterLink}
                            to={`/patients/${patient.id}/edit`}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <CheckInButton 
                          patientId={patient.id} 
                          onCheckInComplete={() => {
                            // Refresh the patient list after check-in
                            const fetchPatients = async () => {
                              try {
                                const res = await axios.get(`/api/patients?page=${page}&search=${search}`, {
                                  headers: {
                                    'X-Handle-Error-Locally': 'true'
                                  }
                                });
                                setPatients(res.data.patients);
                              } catch (err) {
                                console.error(err);
                              }
                            };
                            fetchPatients();
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Delete Patient">
                          <IconButton
                            onClick={() => handleDelete(patient.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  shape="rounded"
                />
              </Stack>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PatientList;