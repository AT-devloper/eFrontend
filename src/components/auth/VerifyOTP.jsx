// pages/VerifyOTP.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { authController } from "./authController";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailVerify = async () => {
    setLoading(true);
    setMessage("");
    try {
      await authController.verifyEmailOtp(userId, emailOtp);
      setMessage("Email verified. Now verify phone.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await authController.verifyPhoneOtp(userId, phoneOtp);
      setMessage(response.message || "Phone verified successfully.");

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/"); // redirect to home or dashboard
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" fontWeight={800} textAlign="center">Verify OTP</Typography>

      {message && <Alert severity={message.includes("success") ? "success" : "info"}>{message}</Alert>}

      <TextField label="Email OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} fullWidth />
      <Button variant="contained" onClick={handleEmailVerify} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Verify Email OTP"}
      </Button>

      <TextField label="Phone OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} fullWidth />
      <Button variant="contained" onClick={handlePhoneVerify} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Verify Phone OTP"}
      </Button>
    </Box>
  );
};

export default VerifyOTP;