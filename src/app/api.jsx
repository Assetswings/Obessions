import axios from "axios";
const API = axios.create({
  baseURL: "https://apis-staging.obsessions.co.in/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token from localStorage or Redux
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403) && // check both
//       (
//         error.response.data?.message === "Invalid authentication token." ||
//         error.response.data?.message === "Token is Expired" ||
//         error.response.data?.message === "Token is Invalid" ||
//         error.response.data?.message === "No token provided." ||
//         error.response.data?.message === "Authorization Token not found"
//       )
//     ) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
