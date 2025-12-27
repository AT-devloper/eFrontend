import React, { useState } from "react";
import { login } from "../../services/AuthService";
import GoogleLogin from "./Googlelogin";

const UniversalLogin = ({ setToken }) => {
  const [loginType, setLoginType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ identifier, password, loginType });
      localStorage.setItem("token", data);
      setToken(data);
      setMessage(`✅ ${loginType} login successful!`);
    } catch (err) {
      setMessage(err.response?.data || "❌ Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {/* Switch login type */}
      <div style={styles.loginType}>
        <button
          onClick={() => setLoginType("email")}
          style={loginType === "email" ? styles.activeButton : styles.button}
        >
          Email
        </button>
        <button
          onClick={() => setLoginType("phone")}
          style={loginType === "phone" ? styles.activeButton : styles.button}
        >
          Phone
        </button>
        <button
          onClick={() => setLoginType("username")}
          style={loginType === "username" ? styles.activeButton : styles.button}
        >
          Username
        </button>
      </div>

      {/* Login form */}
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
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
      </form>

      {/* Status message */}
      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      {/* Google login */}
      <div style={{ marginTop: 20 }}>
        <GoogleLogin
          googleClientId="YOUR_GOOGLE_CLIENT_ID"
          setToken={setToken}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
};

const styles = {
  container: { padding: 20, border: "1px solid #ccc", borderRadius: 5 },
  loginType: { display: "flex", gap: 10, marginBottom: 10 },
  button: { flex: 1, padding: 8, cursor: "pointer", backgroundColor: "#eee", border: "none" },
  activeButton: { flex: 1, padding: 8, cursor: "pointer", backgroundColor: "#007BFF", color: "#fff", border: "none" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 10, fontSize: 16 },
  submitButton: { padding: 10, fontSize: 16, cursor: "pointer", backgroundColor: "#1976d2", color: "#fff", border: "none" },
};

export default UniversalLogin;
