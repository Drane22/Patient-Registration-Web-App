import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';

const usePatientForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  // Ensure data is properly formatted when received from server
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Initializing form with data:', initialData);
      // Force a complete reset of the form data with the new initialData
      const formattedData = {
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
        gender: initialData.gender || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        emergencyContactName: initialData.emergencyContactName || '',
        emergencyContactPhone: initialData.emergencyContactPhone || ''
      };
      
      // Use a timeout to ensure the state update happens after the component has fully initialized
      setTimeout(() => {
        setFormData(formattedData);
        console.log('Form data initialized with timeout:', formattedData);
      }, 0);
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
    
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      ['firstName', 'First name'],
      ['lastName', 'Last name'],
      ['dateOfBirth', 'Date of birth'],
      ['gender', 'Gender'],
      ['address', 'Address'],
      ['city', 'City'],
      ['state', 'State'],
      ['zipCode', 'Zip code']
    ];

    requiredFields.forEach(([field, label]) => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Zip code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Zip code must be exactly 4 digits';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 11 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (patientId = null) => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return false;
    }
    
    setLoading(true);
    
    try {
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : null
      };
      
      const config = {
        headers: {
          'X-Handle-Error-Locally': 'true'
        }
      };
      
      if (patientId) {
        await axios.put(`/api/patients/${patientId}`, formattedData, config);
        toast.success('Patient updated successfully');
      } else {
        await axios.post('/api/patients', formattedData, config);
        toast.success('Patient registered successfully');
      }
      
      return true;
    } catch (err) {
      console.error(err);
      
      if (err.response?.data?.msg) {
        if (err.response.data.msg.includes('email already exists')) {
          setErrors(prev => ({
            ...prev,
            email: 'Email address is already registered'
          }));
          toast.error('Email address is already registered');
        } else {
          const errorMsg = err.response.data.msg;
          toast.error(errorMsg);
          setErrors(prev => ({
            ...prev,
            submit: errorMsg
          }));
        }
      } else if (err.response?.data?.errors) {
        const serverErrors = {};
        const errorMessages = [];
        err.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
          errorMessages.push(`${error.msg}`);
        });
        setErrors(serverErrors);
        if (errorMessages.length > 0) {
          toast.error(errorMessages.join('\n'));
        } else {
          toast.error('Please fix the validation errors in the form');
        }
      } else if (err.response?.status === 404) {
        const errorMsg = 'Patient not found';
        toast.error(errorMsg);
        setErrors(prev => ({
          ...prev,
          submit: errorMsg
        }));
      } else if (err.response?.status === 500) {
        const errorMsg = 'Server error occurred. Please try again later.';
        toast.error(errorMsg);
        setErrors(prev => ({
          ...prev,
          submit: errorMsg
        }));
      } else {
        const errorMsg = 'Failed to save patient. Please try again.';
        toast.error(errorMsg);
        setErrors(prev => ({
          ...prev,
          submit: errorMsg
        }));
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    handleChange,
    handleDateChange,
    submitForm
  };
};

export default usePatientForm;
