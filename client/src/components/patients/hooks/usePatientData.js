import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const usePatientData = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Add custom header to indicate we'll handle errors locally
        const res = await axios.get(`/api/patients/${patientId}`, {
          headers: {
            'X-Handle-Error-Locally': 'true'
          }
        });
        // Ensure date is properly parsed
        setPatient({
          ...res.data,
          dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth) : null
        });
        setError(null);
      } catch (err) {
        console.error(err);
        // Enhanced error handling with more specific messages
        if (err.response) {
          const statusCode = err.response.status;
          const errorMsg = err.response.data?.msg || 'Server returned an error';
          
          if (statusCode === 404) {
            setError(`Patient not found: ${errorMsg}`);
            toast.error(`Patient not found: ${errorMsg}`);
            setPatient(null);
          } else if (statusCode === 500) {
            setError('Server error occurred. Please try again later.');
            toast.error('Server error occurred. Please try again later.');
          } else {
            setError(`Failed to fetch patient details: ${errorMsg}`);
            toast.error(`Failed to fetch patient details: ${errorMsg}`);
          }
        } else if (err.request) {
          setError('No response received from server. Please check your connection.');
          toast.error('No response received from server. Please check your connection.');
        } else {
          setError('Request failed. Please try again.');
          toast.error('Request failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  return { patient, loading, error };
};

export default usePatientData;