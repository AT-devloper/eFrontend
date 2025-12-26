import axios from "axios";

// 1️⃣ Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:8080", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 2️⃣ Request interceptor to add Authorization token automatically
API.interceptors.request.use((config) => {
  const publicEndpoints = ["/auth/send-otp", "/auth/validate-otp", "/auth/reset-password"];
  
  // Only add token if endpoint is NOT public
  if (!publicEndpoints.includes(config.url)) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));


// 3️⃣ Response interceptor (optional for error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Please login again.");
      // Optionally, redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
