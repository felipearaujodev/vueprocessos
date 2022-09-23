import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7025/api/',
    timeout: 1000,
    headers: {
    }
  });

  export default api;