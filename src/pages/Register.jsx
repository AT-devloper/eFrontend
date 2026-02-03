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
  Divider
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

const Register = ({ switchToLogin, onSuccess }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const redirectTo = searchParams.get("redirect") || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authController.register(form);
      const { token, user } = response.data; 
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      setMessage("Registration successful!");
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-register-btn"),
      { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: "100%" }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;
      const { token, user } = await authController.googleLogin(idToken);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); 

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ color: "primary.main", mb: 1 }}>
        Join AT-LUXE
      </Typography>

      {message && (
        <Alert severity={message.includes("successful") ? "success" : "error"} sx={{ borderRadius: 3 }}>
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField 
          label="Full Name" 
          name="username" 
          value={form.username} 
          onChange={handleChange} 
          required 
          fullWidth 
          InputProps={{ sx: { borderRadius: 3 } }}
        />
        <TextField 
          label="Email Address" 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          fullWidth 
          InputProps={{ sx: { borderRadius: 3 } }}
        />
        <TextField 
          label="Phone Number" 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          required 
          fullWidth 
          InputProps={{ sx: { borderRadius: 3 } }}
        />
        <TextField 
          label="Password" 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          fullWidth 
          InputProps={{ sx: { borderRadius: 3 } }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ 
            py: 1.6, 
            mt: 1,
            borderRadius: 50, 
            fontWeight: 800, 
            fontSize: "1rem",
            boxShadow: "0 6px 20px rgba(74, 46, 46, 0.2)"
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ px: 2, color: "text.disabled", fontWeight: 700 }}>OR</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box id="google-register-btn" sx={{ width: "100%" }}></Box>

      <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mt: 1 }}>
        Already a member?{" "}
        <Link 
          component="button" 
          onClick={switchToLogin} 
          sx={{ fontWeight: 800, color: "primary.main", textDecoration: "none" }}
        >
          Sign In
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;