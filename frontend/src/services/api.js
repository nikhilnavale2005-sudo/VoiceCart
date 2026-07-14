import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.163.16.155:5000/api',
});

export default api;
