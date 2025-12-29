import React, { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";


const AuthToggleCard = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'

  return (
    <div className="auth-card">
      {/* Toggle Buttons */}
      <div className="auth-toggle">
        <button
          onClick={() => setActiveTab("login")}
          className={`toggle-btn ${activeTab === "login" ? "active" : ""}`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`toggle-btn ${activeTab === "register" ? "active" : ""}`}
        >
          Register
        </button>
      </div>

      {/* Forms */}
      <div className="auth-form-container">
        <div className={activeTab === "login" ? "active-form" : "inactive-form"}>
          <Login />
        </div>
        <div className={activeTab === "register" ? "active-form" : "inactive-form"}>
          <Register />
        </div>
      </div>
    </div>
  );
};

export default AuthToggleCard;
