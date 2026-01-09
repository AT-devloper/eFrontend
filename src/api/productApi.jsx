// src/api/productApi.jsx
import axios from "axios";

const productApi = axios.create({
  baseURL: "http://localhost:8080", // note: no /auth
  headers: { "Content-Type": "application/json" },
});

export default productApi;
