import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Only attach JWT for protected routes
api.interceptors.request.use(
  (config) => {
    // List of public endpoints that should NOT include JWT
    const publicEndpoints = [
  "/register",
  "/verify/email",
  "/verify/phone",
];

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
