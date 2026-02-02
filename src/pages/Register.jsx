import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "../components/auth/authController";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";

const Register = ({ switchToLogin }) => {
  const { setUser } = useUser();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await authController.register(form);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(switchToLogin, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login Button Initialization ---
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-register-btn"),
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

      if (!token || !user) throw new Error("Google login failed");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); // update context
      window.location.href = "/"; // redirect to home
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} textAlign="center">
        Register
      </Typography>

      {message && <Alert severity="info">{message}</Alert>}

      <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth />
        <TextField label="Name/Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />

        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5 }}>
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </Box>

      {/* Google login button */}
      <Box id="google-register-btn" sx={{ display: "flex", justifyContent: "center", mt: 2 }}></Box>

      <Typography variant="body2" textAlign="center" mt={1}>
        Already have an account?{" "}
        <Link component="button" onClick={switchToLogin} sx={{ fontWeight: 600 }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
