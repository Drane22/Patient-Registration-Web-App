import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CheckInButton = ({ patientId, onCheckInComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (window.confirm('Are you sure you want to check in this patient?')) {
      setLoading(true);
      try {
        const res = await axios.put(`/api/checkin/${patientId}`, {}, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        
        toast.success('Patient checked in successfully');
        
        if (onCheckInComplete && typeof onCheckInComplete === 'function') {
          onCheckInComplete(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to check in patient');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleCheckIn}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : <AccessTimeIcon />}
      size="small"
    >
      {loading ? 'Checking in...' : 'Check In'}
    </Button>
  );
};

export default CheckInButton;
