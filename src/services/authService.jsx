import api from "../api/axiosinstance";

export const authService = {
  register: (data) => api.post("/register", data),

  verifyEmailOtp: (email, otp) =>
    api.post(`/verify/email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`),

  verifyPhoneOtp: (phone, otp) =>
    api.post(`/verify/phone?phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`),

  login: (data) => api.post("/login", data),
  
  googleLogin: (idToken) => api.post("/google", { idToken }),

  requestPasswordReset: (email) =>
  api.post(`/forgot-password?email=${encodeURIComponent(email)}`),

 verifyResetToken: (token) => api.get(`/reset-password/validate?token=${encodeURIComponent(token)}`),

  resetPassword: (data) => api.post("/reset-password", data),
};
