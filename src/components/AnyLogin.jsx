import React, { useState } from "react";
import API from "../API/axiosInstance";

const AnyLogin = ({ setToken, setMessage, loginType = "email" }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { password };

      if (loginType === "email") payload.email = identifier;
      else if (loginType === "phone") payload.phone = identifier;
      else if (loginType === "username") payload.username = identifier;

      const res = await API.post("/auth/login", payload);
      localStorage.setItem("token", res.data);
      setToken(res.data);
      setMessage(`✅ ${loginType} login successful!`);
    } catch (err) {
      setMessage(err.response?.data || "❌ Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{loginType.charAt(0).toUpperCase() + loginType.slice(1)} Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder={`Enter your ${loginType}`}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: 20, border: "1px solid #ccc", borderRadius: 5 },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 10, fontSize: 16 },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
  },
};

export default AnyLogin;
