import axios from "axios";

const BASE_URL = "http://localhost:8080/user";

const UserService = {
  // Get all users
  getUsers: () => {
    return axios.get(`${BASE_URL}/get`);
  },

  // Save user
  saveUser: (user) => {
    return axios.post(`${BASE_URL}/save`, user);
  },

  // Delete user by ID
  deleteUser: (id) => {
    return axios.delete(`${BASE_URL}/delete/${id}`);
  }
};

export default UserService;
