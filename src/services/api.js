import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", 
});

// JWT token request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for authentication
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      // Only redirect if there's truly no token
      if (!token) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
