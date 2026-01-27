import axios from "axios";

const API = axios.create({
  baseURL: "https://apis-staging.obsessions.co.in/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    // 🚫 stop request if offline
    if (!navigator.onLine) {
      return Promise.reject({ isOffline: true });
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔐 AUTH ERRORS
    if (
      error.response &&
      [401, 403].includes(error.response.status) &&
      [
        "Invalid authentication token.",
        "Token is Expired",
        "Token is Invalid",
        "No token provided.",
        "Authorization Token not found"
      ].includes(error.response.data?.message)
    ) {
      localStorage.clear();
      window.location.href = "/login";
    }

    // ❌ PAGE ERRORS
    if (error.response && [404].includes(error.response.status)) {
      window.location.href = "/not-found";
    }
    return Promise.reject(error);
  }
);

export default API;
