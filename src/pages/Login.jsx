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
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const Login = ({ switchToRegister, switchToForgot, onSuccess }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const response = await authController.login(form);
    const { token, user } = response;

    if (!token || !user) throw new Error("Invalid response from server");

    // 1️⃣ Store token and user
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    // 2️⃣ Decode JWT to get roles
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];
    localStorage.setItem("roles", JSON.stringify(roles)); // ✅ key step

    if (onSuccess) onSuccess(); 
    else navigate(redirectTo);
  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed. Check credentials or Server.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "768380657938-cslmvflgrt2vsbos5nca61dg56g7hiqj.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large", shape: "pill", text: "signin_with", width: "340" }
      );
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const data = await authController.googleLogin(response.credential);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      if (onSuccess) onSuccess(); else navigate(redirectTo);
    } catch (err) {
      setMessage("Google login failed.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ color: "primary.main", mb: 1 }}>
        Welcome Back
      </Typography>

      {message && <Alert severity="error" sx={{ borderRadius: 3, fontSize: '0.85rem' }}>{message}</Alert>}

      <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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

        <Box>
          <TextField 
            label="Password" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            value={form.password} 
            onChange={handleChange} 
            required 
            fullWidth 
            InputProps={{ 
              sx: { borderRadius: 3 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            {/* FIXED FORGOT PASSWORD LINK */}
            <MuiLink 
              component="button" 
              type="button" 
              onClick={(e) => {
                e.preventDefault(); // Prevents form from trying to submit
                switchToForgot();
              }} 
              sx={{ 
                fontWeight: 700, 
                color: "text.secondary", 
                textDecoration: "none", 
                fontSize: '0.75rem',
                cursor: "pointer", // Makes the "Hand" icon appear
                border: "none",
                background: "none",
                '&:hover': { color: 'primary.main' }
              }}
            >
              Forgot Password?
            </MuiLink>
          </Box>
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ py: 1.8, borderRadius: 50, fontWeight: 800, textTransform: "none" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 1.5 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ px: 2, color: "text.disabled", fontWeight: 700 }}>OR</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box id="google-login-btn" sx={{ display: "flex", justifyContent: "center" }}></Box>

      <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mt: 2 }}>
        New to AT-LUXE?{" "}
        {/* FIXED REGISTER LINK */}
        <MuiLink 
          component="button" 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            switchToRegister();
          }} 
          sx={{ 
            fontWeight: 800, 
            color: "primary.main", 
            textDecoration: "none", 
            cursor: "pointer", // Essential for visibility
            border: "none",
            background: "none",
            padding: 0
          }}
        >
          Create Account
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Login;