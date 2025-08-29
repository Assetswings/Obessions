
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

// 🔹 Response Interceptor → Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
         (
        error.response.data?.status === "Token is Expired" ||
        error.response.data?.status === "Token is Invalid" ||
        error.response.data?.status === "User is Blocked." ||
        error.response.data?.status === "Authorization Token not found"
        )
    ) {
      localStorage.clear(); 
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export default API;
