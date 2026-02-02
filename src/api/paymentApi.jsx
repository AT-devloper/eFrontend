import axios from "axios";

const API_URL = "http://localhost:8080";

/**
 * Create a one-time order
 * @param {number} amount - Amount in paise (₹ → multiply by 100)
 * @param {number} userId - Real user ID
 * @param {number} [testAmount] - Optional smaller amount for testing
 * @returns {object} - { orderId, key, amount, error }
 */
export const createOrder = async (amount, userId, testAmount) => {
  try {
    const res = await axios.post(`${API_URL}/auth/payment/create-order`, {
      amount,
      userId,
      testAmount,
    });
    return { ...res.data, error: null };
  } catch (err) {
    console.error("❌ createOrder error:", err.response?.data || err.message);
    const message = err.response?.data?.message || err.response?.data?.error || "Failed to create order";
    return { error: message };
  }
};

/**
 * Create a subscription
 * @param {number} userId - Real user ID
 * @returns {object} - { subscriptionId, key, error }
 */
export const createSubscription = async (userId) => {
  try {
    const res = await axios.post(`${API_URL}/auth/payment/create-subscription`, { userId });
    return { ...res.data, error: null };
  } catch (err) {
    console.error("❌ createSubscription error:", err.response?.data || err.message);
    const message = err.response?.data?.message || err.response?.data?.error || "Failed to create subscription";
    return { error: message };
  }
};
