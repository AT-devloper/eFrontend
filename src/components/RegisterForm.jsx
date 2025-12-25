import React, { useState, useEffect } from "react";
import API from "../API Configuration/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔁 Reset
  const resetForm = () => {
    setFormData({ email: "", username: "", phone: "", password: "" });
    setEmailOtp("");
    setPhoneOtp("");
    setEmailVerified(false);
    setPhoneVerified(false);
    setOtpSent(false);
    setMessage("");
  };

  // 📩 SEND OTP (calls /auth/register)
  const sendOtp = async () => {
    try {
      await API.post("/auth/register", formData);
      setOtpSent(true);
      setMessage("📨 OTP sent to Email & Phone");
    } catch (err) {
      setMessage(err.response?.data || "Failed to send OTP");
    }
  };

  // ✅ Auto verify email OTP
  useEffect(() => {
    if (emailOtp.length === 6 && !emailVerified) {
      API.post("/auth/verify/email", null, {
        params: { email: formData.email, otp: emailOtp },
      })
        .then(() => {
          setEmailVerified(true);
          setMessage("✅ Email verified");
        })
        .catch(() => setMessage("❌ Invalid Email OTP"));
    }
  }, [emailOtp]);

  // ✅ Auto verify phone OTP
  useEffect(() => {
    if (phoneOtp.length === 6 && !phoneVerified) {
      API.post("/auth/verify/phone", null, {
        params: { phone: formData.phone, otp: phoneOtp },
      })
        .then(() => {
          setPhoneVerified(true);
          setMessage("✅ Phone verified");
        })
        .catch(() => setMessage("❌ Invalid Phone OTP"));
    }
  }, [phoneOtp]);

  return (
    <div style={{ width: 420, margin: "auto" }}>
      <h2>User Registration</h2>

      {/* FORM */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      /><br /><br />

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      /><br /><br />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      /><br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      /><br /><br />

      {/* BUTTONS */}
      {!otpSent && (
        <button onClick={sendOtp}>Send OTP</button>
      )}
      <button onClick={resetForm} style={{ marginLeft: 10 }}>
        Reset
      </button>

      <p>{message}</p>

      {/* EMAIL OTP */}
      {otpSent && !emailVerified && (
        <>
          <h4>Email OTP</h4>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
          />
        </>
      )}

      {/* PHONE OTP */}
      {otpSent && !phoneVerified && (
        <>
          <h4>Phone OTP</h4>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter Phone OTP"
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
          />
        </>
      )}

      {/* FINAL SUCCESS */}
      {emailVerified && phoneVerified && (
        <h3 style={{ color: "green" }}>
          🎉 Registration Completed Successfully
        </h3>
      )}
    </div>
  );
};

export default RegisterForm;
