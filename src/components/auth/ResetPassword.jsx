import React, { useState, useEffect } from "react";
import { authController } from "./authController";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";

const ResetPassword = ({ token, switchToLogin }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage("No token provided");
        setLoading(false);
        return;
      }

      try {
        await authController.verifyResetToken(token);
        setTokenValid(true);
      } catch {
        setMessage("Invalid or expired token");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await authController.resetPassword({ token, password });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(switchToLogin, 1500);
    } catch {
      setMessage("Failed to reset password.");
    }
  };

  if (loading) return <Typography>Validating token...</Typography>;
  if (!tokenValid) return <Typography>{message}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={600} textAlign="center">
        Reset Password
      </Typography>

      {message && <Alert severity={message.toLowerCase().includes("success") ? "success" : "error"}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <TextField type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />

        <Button type="submit" variant="contained" color="primary" sx={{ py: 1.5 }}>
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
