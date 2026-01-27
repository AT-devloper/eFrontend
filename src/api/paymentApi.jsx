import axios from "axios";

const API_URL = "http://localhost:8080";

export const createOrder = async (amount, userId, testAmount) => {
  const res = await axios.post(`${API_URL}/auth/payment/create-order`, {
    amount,
    userId,
    testAmount, // optional, reduce for testing
  });
  return res.data; // { orderId, key, amount }
};

export const createSubscription = async (userId) => {
  const res = await axios.post(`${API_URL}/auth/payment/create-subscription`, { userId });
  return res.data; // { subscriptionId, key }
};
