import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../components/auth/authController";

const Login = () => {
  const navigate = useNavigate(); // for navigation
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = emailOrPhone.includes("@")
        ? { email: emailOrPhone, password }
        : { phone: emailOrPhone, password };

      const token = await authController.login(payload);
      localStorage.setItem("token", token);
      alert("Login successful!");
    } catch (err) {
      setError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirect to Forgot Password page
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Email or Phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Forgot Password Button */}
        <p className="forgot-password" onClick={handleForgotPassword} style={{cursor: "pointer", marginTop: "10px", color: "blue"}}>
          Forgot Password?
        </p>
      </form>
    </div>
  );
};

export default Login;
