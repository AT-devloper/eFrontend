import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/auth", // Base URL for all auth/rbac calls
  headers: { "Content-Type": "application/json" },
});

// Attach JWT for protected routes
api.interceptors.request.use(
  (config) => {
    const publicEndpoints = ["/register", "/verify/email", "/verify/phone", "/google"];
    if (!publicEndpoints.includes(config.url)) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;