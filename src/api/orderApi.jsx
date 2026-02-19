import axios from "axios";

const BASE_URL = "http://localhost:8080/auth/orders";

const orderApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
orderApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const orderService = {
  getUserOrders: async (userId) => {
    try {
      const res = await orderApi.get(`/user/${userId}`);
      return res.data;
    } catch (error) {
      console.error("[Orders] Fetch error:", error);
      throw error;
    }
  },

  getOrderByNumber: async (orderNumber) => {
    try {
      const res = await orderApi.get(`/${orderNumber}`);
      return res.data;
    } catch (error) {
      console.error("[Orders] Fetch by number error:", error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const res = await orderApi.get("/all");
      return res.data;
    } catch (error) {
      console.error("[Orders] Fetch all error:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await orderApi.put(`/${orderId}/status`, { status });
      return res.data;
    } catch (error) {
      console.error("[Orders] Update status error:", error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const res = await orderApi.put(`/${orderId}/cancel`);
      return res.data;
    } catch (error) {
      console.error("[Orders] Cancel error:", error);
      throw error;
    }
  },

  requestReturn: async (orderId) => {
  try {
    const res = await orderApi.put(`/${orderId}/return`);
    return res.data;
  } catch (error) {
    console.error("[Orders] Return error:", error);
    throw error;
  }
},

};

export default orderService;
