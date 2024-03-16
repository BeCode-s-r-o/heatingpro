import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5500/', //'https://api.monitoringpro.sk/',
  headers: {
    'mp-auth': localStorage.getItem('mp-auth') || '',
  },
});

export default axiosInstance;
