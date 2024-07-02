import axios from 'axios';
import { BASE_URL } from '../constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

appAxios.interceptors.request.use(
  async (config) => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const token = `Bearer ${userToken}`;
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

appAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 500) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('userToken'); // Clear the token from local storage
      window.location.href = '/login'; // Redirect to the login page
    }
    return Promise.reject(error);
  }
);

export default appAxios;
