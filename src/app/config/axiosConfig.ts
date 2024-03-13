import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.monitoringpro.sk/',
  headers: {
    'mp-auth': localStorage.getItem('monitoringpro-auth') || '',
  },
});

export default axiosInstance;
