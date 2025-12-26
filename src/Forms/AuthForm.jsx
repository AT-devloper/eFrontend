import React, { useState, useEffect } from "react";
import API from "../API Configuration/api";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [otpMode, setOtpMode] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    emailOtp: "",
    phoneOtp: "",
    emailVerified: false,
    phoneVerified: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------- REGISTER ---------------- */
  const registerUser = async () => {
    try {
      const res = await API.post("/auth/register", {
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
      });

      setMessage(res.data || "OTPs sent to email & phone");
      setOtpMode(true);
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
    }
  };

  /* ---------------- LOGIN ---------------- */
  const loginUser = async () => {
    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data);
      setMessage("Login successful ✅");
    } catch {
      setMessage("Invalid credentials ❌");
    }
  };

  /* ---------------- VERIFY EMAIL OTP ---------------- */
  const verifyEmailOtp = async (otp) => {
    try {
      await API.post(
        `/auth/verify/email?email=${formData.email}&otp=${otp}`
      );
      setFormData((prev) => ({ ...prev, emailVerified: true }));
      setMessage("Email verified ✅");
    } catch {
      setMessage("Invalid email OTP ❌");
    }
  };

  /* ---------------- VERIFY PHONE OTP ---------------- */
  const verifyPhoneOtp = async (otp) => {
    try {
      await API.post(
        `/auth/verify/phone?phone=${formData.phone}&otp=${otp}`
      );
      setFormData((prev) => ({ ...prev, phoneVerified: true }));
      setMessage("Phone verified ✅");
    } catch {
      setMessage("Invalid phone OTP ❌");
    }
  };

  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    isRegister ? registerUser() : loginUser();
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ width: 400, margin: "auto", fontFamily: "Arial" }}>
      {/* TOGGLE */}
      {!otpMode && (
        <div style={{ display: "flex", marginBottom: 15 }}>
          <button onClick={() => setIsRegister(false)} style={btn(!isRegister)}>
            Login
          </button>
          <button onClick={() => setIsRegister(true)} style={btn(isRegister)}>
            Register
          </button>
        </div>
      )}

      {/* FORM */}
      {!otpMode && (
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            onChange={handleChange}
            style={input}
          />

          {isRegister && (
            <>
              <input
                name="phone"
                placeholder="Phone"
                required
                onChange={handleChange}
                style={input}
              />
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                style={input}
              />
            </>
          )}

          <input
            name="password"
            placeholder="Password"
            type="password"
            required
            onChange={handleChange}
            style={input}
          />

          <button type="submit" style={submitBtn}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      )}

      {/* OTP MODE */}
      {otpMode && (
        <>
          {!formData.emailVerified && (
            <input
              placeholder="Email OTP"
              value={formData.emailOtp}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v) && v.length <= 6) {
                  setFormData({ ...formData, emailOtp: v });
                  if (v.length === 6) verifyEmailOtp(v);
                }
              }}
              style={input}
            />
          )}

          {!formData.phoneVerified && (
            <input
              placeholder="Phone OTP"
              value={formData.phoneOtp}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v) && v.length <= 6) {
                  setFormData({ ...formData, phoneOtp: v });
                  if (v.length === 6) verifyPhoneOtp(v);
                }
              }}
              style={input}
            />
          )}

          {formData.emailVerified && formData.phoneVerified && (
            <button
              style={{ ...submitBtn, background: "green" }}
              onClick={() => {
                setOtpMode(false);
                setIsRegister(false);
                setMessage("🎉 Registration complete! Login now.");
              }}
            >
              Continue to Login
            </button>
          )}
        </>
      )}

      <p style={{ color: "red", marginTop: 10 }}>{message}</p>
    </div>
  );
};

/* ---------------- STYLES ---------------- */
const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const submitBtn = {
  width: "100%",
  padding: 10,
  background: "#007BFF",
  color: "#fff",
  border: "none",
};

const btn = (active) => ({
  flex: 1,
  padding: 10,
  background: active ? "#007BFF" : "#eee",
  color: active ? "#fff" : "#000",
  border: "none",
});

export default AuthForm;
