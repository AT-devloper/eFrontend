import axios from "axios";

// 1️⃣ Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:8080", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 2️⃣ Request interceptor to add Authorization token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
