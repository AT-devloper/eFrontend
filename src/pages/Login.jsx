import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "../components/auth/authController";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { token, user } = await authController.login(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google Login Button
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 280,
      }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;
      const { token, user } = await authController.googleLogin(idToken);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={600} textAlign="center">Login</Typography>
      {message && <Alert severity="error">{message}</Alert>}

      <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Box>

      <Box id="google-login-btn" sx={{ display: "flex", justifyContent: "center", mt: 2 }}></Box>
    </Box>
  );
};

export default Login;
