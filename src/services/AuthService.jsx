import API from "../API/axiosInstance";


// Login
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

// Send OTP
export const sendEmailOtp = async (email) => {
  const res = await API.post("/auth/send-email-otp", null, { params: { email } });
  return res.data;
};

export const sendPhoneOtp = async (phone) => {
  const res = await API.post("/auth/send-phone-otp", null, { params: { phone } });
  return res.data;
};

// Verify OTP
export const verifyEmailOtp = async (email, otp) => {
  const res = await API.post("/auth/verify/email", null, { params: { email, otp } });
  return res.data;
};

export const verifyPhoneOtp = async (phone, otp) => {
  const res = await API.post("/auth/verify/phone", null, { params: { phone, otp } });
  return res.data;
};

// Register user
export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  return res.data;
};


// Forgot Password
export const sendOtp = async (email) => {
  const res = await fetch(`/auth/forgot-password/send-otp?email=${email}`, { method: "POST" });
  return res.text();
};

export const validateOtp = async (userId, otp) => {
  const res = await fetch(`/auth/forgot-password/validate-otp?userId=${userId}&otp=${otp}`, { method: "POST" });
  return res.ok;
};

export const resetPassword = async (userId, newPassword) => {
  const res = await fetch(`/auth/forgot-password/reset-password?userId=${userId}&newPassword=${newPassword}`, { method: "POST" });
  return res.text();
};

// Register
export const register = async (formData) => {
  const res = await API.post("/auth/register", formData);
  return res.data;
};

// Universal login: email / phone / username
export const universalLogin = async ({ identifier, type, password }) => {
  const payload = { password };
  if (type === "email") payload.email = identifier;
  else if (type === "phone") payload.phone = identifier;
  else if (type === "username") payload.username = identifier;

  const res = await API.post("/auth/login", payload);
  return res.data;
};

// Google login
export const googleLogin = async (idToken) => {
  const res = await API.post("/auth/google", { idToken });
  return res.data; // assuming backend returns { token, email, name, ... }
};

