import axiosInstance from "../API/axiosInstance";

export const login = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const register = (data) => {
  return axiosInstance.post("/auth/register", data);
};
