// import axios from 'axios';
// const API = axios.create({
//   baseURL: 'https://apis-staging.obsessions.co.in/v1',
// });
// // https://b2c.obsessionsgroup.com/api
// export default API; 
// src/app/api.js

import axios from 'axios';
const API = axios.create({
  baseURL: 'https://apis-staging.obsessions.co.in/v1',
  headers: {
  'Content-Type': 'application/json',
  },
});

// Interceptor to attach token from localStorage or Redux
   API.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem('token'); 
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
     }
    return config;
   },
  (error) => Promise.reject(error)
);

export default API;
