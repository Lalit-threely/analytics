import axios, { AxiosInstance } from 'axios';

// Define the base URL for API requests
  const baseURL = 'https://staging.tria.so'
  // const baseURL = 'https://prod.tria.so'
//   const baseURL = 'http://localhost:8000'




// Create an instance of Axios with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v2`, // Base URL for all requests
  headers: {
    'Content-Type': 'application/json' // Default content type
  }
});

// Add a request interceptor to include the access token in the headers
axiosInstance.interceptors.request.use(config => {
  const token = window.localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
