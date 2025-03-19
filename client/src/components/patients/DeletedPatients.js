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
  Pagination,
  Stack,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { format } from 'date-fns';

const DeletedPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  // Fetch deleted patients on component mount and when page changes
  useEffect(() => {
    const fetchDeletedPatients = async () => {
      setLoading(true);
      try {
        // Add custom header to indicate we'll handle errors locally
        const res = await axios.get(`/api/patients/deleted/all?page=${page}`, {
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
          toast.error(`Failed to fetch deleted patients: ${errorMsg}`);
        } else if (err.request) {
          toast.error('Failed to fetch deleted patients: No response received from server');
        } else {
          toast.error('Failed to fetch deleted patients: Request failed');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedPatients();
  }, [page]);

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle patient restoration
  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this patient data?')) {
      try {
        await axios.put(`/api/patients/${id}/restore`, {}, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        toast.success('Patient restored successfully');
        // Refresh deleted patient list
        const res = await axios.get(`/api/patients/deleted/all?page=${page}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        setPatients(res.data.patients);
        setTotalPages(res.data.totalPages);
        setTotalPatients(res.data.totalPatients);
      } catch (err) {
        toast.error('Failed to restore patient');
        console.error(err);
      }
    }
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (id) => {
    if (window.confirm('Are you sure you want to PERMANENTLY delete this patient data? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/patients/${id}/permanent`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        toast.success('Patient permanently deleted');
        // Refresh deleted patient list
        const res = await axios.get(`/api/patients/deleted/all?page=${page}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        setPatients(res.data.patients);
        setTotalPages(res.data.totalPages);
        setTotalPatients(res.data.totalPatients);
      } catch (err) {
        toast.error('Failed to permanently delete patient');
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Deleted Patients
          {totalPatients > 0 && (
            <Chip 
              label={`${totalPatients} total`} 
              size="small" 
              sx={{ ml: 2, bgcolor: 'warning.light', color: 'white' }} 
            />
          )}
        </Typography>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/patients"
          startIcon={<ArrowBackIcon />}
        >
          Back to Patients
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : patients.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No deleted patients found
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Deleted On</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {patient.deletedAt ? format(new Date(patient.deletedAt), 'MM/dd/yyyy h:mm a') : 'Unknown'}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Restore Patient">
                            <IconButton
                              onClick={() => handleRestore(patient.id)}
                              size="small"
                              color="warning"
                            >
                              <RestoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Permanently Delete Patient">
                            <IconButton
                              onClick={() => handlePermanentDelete(patient.id)}
                              size="small"
                              color="error"
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
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

export default DeletedPatients;