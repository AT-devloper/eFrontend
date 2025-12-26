import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = ({ onSuccess }) => {
  const [mode, setMode] = useState("login");

  return (
    <div style={{ width: 450, margin: "auto" }}>
      <div style={{ display: "flex", marginBottom: 20 }}>
        <button
          onClick={() => setMode("login")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: mode === "login" ? "#007BFF" : "#eee",
            color: mode === "login" ? "#fff" : "#000",
            border: "none",
          }}
        >
          Login
        </button>

        <button
          onClick={() => setMode("register")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: mode === "register" ? "#007BFF" : "#eee",
            color: mode === "register" ? "#fff" : "#000",
            border: "none",
          }}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onSuccess={onSuccess} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default AuthPage;
