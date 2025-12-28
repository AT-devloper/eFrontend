import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthToggleCard = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      {/* ================= TOGGLE BUTTONS ================= */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab("login")}
          className={`py-2 px-4 rounded ${activeTab === "login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`py-2 px-4 rounded ${activeTab === "register" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Register
        </button>
      </div>

      {/* ================= SHOW LOGIN OR REGISTER ================= */}
      <div>
        {activeTab === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default AuthToggleCard;
