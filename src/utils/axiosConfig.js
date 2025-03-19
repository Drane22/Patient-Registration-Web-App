import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // You can add auth tokens or other request modifications here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Skip global error handling if the component will handle errors itself
    const skipGlobalErrorHandling = error.config?.headers?.['X-Handle-Error-Locally'] === 'true';
    
    if (!skipGlobalErrorHandling) {
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.errors && Array.isArray(data.errors)) {
              // Handle validation errors
              const errorMessage = data.errors.map(err => err.msg).join(', ');
              toast.error(`Validation error: ${errorMessage}`);
            } else if (data.msg) {
              toast.error(data.msg);
            } else {
              toast.error('Invalid request. Please check your data.');
            }
            break;
          case 404:
            toast.error(data.msg || 'Resource not found');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error('An error occurred. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Request failed. Please try again.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;