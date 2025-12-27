import React, { useState } from "react";
import UniversalLogin from "../auth/UniversalLogin";
import RegisterForm from "../auth/RegisterForm";

const AuthForm = ({ onSuccess }) => {
  const [mode, setMode] = useState("login");

  return (
    <div style={{ width: 450, margin: "auto" }}>
      {/* Toggle buttons */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <button
          onClick={() => setMode("login")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: mode === "login" ? "#007BFF" : "#eee",
            color: mode === "login" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
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
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>

      {/* Render login or register */}
      {mode === "login" ? (
        <UniversalLogin
          setToken={(token) => {
            localStorage.setItem("token", token);
            onSuccess && onSuccess(token);
          }}
        />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default AuthForm;
