import { useState } from "react";
import { authController } from "./authController";
import { Box, Button, TextField, Typography, Alert, CircularProgress, Link } from "@mui/material";

const ForgotPassword = ({ switchToLogin, switchToReset }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = await authController.requestPasswordReset(email); // should return reset token
      setMessage("Reset link sent! Redirecting to reset page...");
      setTimeout(() => switchToReset(token), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={600} textAlign="center">
        Forgot Password
      </Typography>

      {message && <Alert severity={message.includes("Failed") ? "error" : "success"}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />

        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5 }}>
          {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center">
        Remembered password?{" "}
        <Link component="button" onClick={switchToLogin} sx={{ fontWeight: 600 }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default ForgotPassword;
