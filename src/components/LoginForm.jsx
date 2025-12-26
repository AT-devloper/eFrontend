import React, { useState } from "react";
import API from "../API/axiosInstance";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data);
      setMessage("✅ Login successful");
    } catch (err) {
      setMessage(err.response?.data || "❌ Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br /><br />

      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
};

export default LoginForm;
