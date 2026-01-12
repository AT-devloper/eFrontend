import { authService } from "../../services/AuthService";

export const authController = {
  async register(data) {
    const res = await authService.register(data);
    return res.data;
  },

  async verifyEmailOtp(email, otp) {
    const res = await authService.verifyEmailOtp(email, otp);
    return res.data;
  },

  async verifyPhoneOtp(phone, otp) {
    const res = await authService.verifyPhoneOtp(phone, otp);
    return res.data;
  },

  async login(data) {
    const res = await authService.login(data);
    return res.data;
  },

  async googleLogin(idToken) {
    const res = await authService.googleLogin(idToken);
    return res.data;
  },

  // ✅ Fixed requestPasswordReset
  async requestPasswordReset(email) {
  const res = await authService.requestPasswordReset(email);
  return res.data;
},

  async verifyResetToken(token) {
    const res = await authService.verifyResetToken(token);
    return res.data;
  },

  async resetPassword(data) {
    const res = await authService.resetPassword(data);
    return res.data;
  },
};
