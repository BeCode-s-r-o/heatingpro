import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const axiosInstance = axios.create({
  baseURL: isDev ? 'http://localhost:5500/' : 'https://api.monitoringpro.sk/',
  headers: {
    'mp-auth': localStorage.getItem('mp-auth') || '',
  },
});

export default axiosInstance;
