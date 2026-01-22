import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

const getToken = () => localStorage.getItem("token");

export const cartApi = {
  getCart: async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      return [];
    }
  },

  addToCart: async ({ productId, variantId, quantity = 1 }) => {
    try {
      const res = await axios.post(
        `${API_URL}/add`,
        { productId, variantId, quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err;
    }
  },

  removeItem: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/remove/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to remove item:", err);
      throw err;
    }
  },
};
