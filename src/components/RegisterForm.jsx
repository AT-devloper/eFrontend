import React, { useState, useEffect } from "react";
import API from "../API/axiosInstance";

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
  const [googleMessage, setGoogleMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ email: "", username: "", phone: "", password: "" });
    setEmailOtp("");
    setPhoneOtp("");
    setEmailVerified(false);
    setPhoneVerified(false);
    setOtpSent(false);
    setMessage("");
    setGoogleMessage("");
  };

  // 🔁 Send OTP (manual registration)
  const sendOtp = async () => {
    try {
      await API.post("/auth/register", formData);
      setOtpSent(true);
      setMessage("📨 OTP sent to Email & Phone");
    } catch (err) {
      setMessage(err.response?.data || "❌ Failed to send OTP");
    }
  };

  // ✅ Auto verify Email OTP
  useEffect(() => {
    if (emailOtp.length === 6 && otpSent && !emailVerified) {
      API.post("/auth/verify/email", null, {
        params: { email: formData.email, otp: emailOtp },
      })
        .then(() => {
          setEmailVerified(true);
          setMessage("✅ Email verified");
        })
        .catch(() => {
          setMessage("❌ Invalid Email OTP");
          setEmailOtp("");
        });
    }
  }, [emailOtp]);

  // ✅ Auto verify Phone OTP
  useEffect(() => {
    if (phoneOtp.length === 6 && otpSent && !phoneVerified) {
      API.post("/auth/verify/phone", null, {
        params: { phone: formData.phone, otp: phoneOtp },
      })
        .then(() => {
          setPhoneVerified(true);
          setMessage("✅ Phone verified");
        })
        .catch(() => {
          setMessage("❌ Invalid Phone OTP");
          setPhoneOtp("");
        });
    }
  }, [phoneOtp]);

  // 🌐 Google Login Setup
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById("google-js")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.id = "google-js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initializeGoogle;
      } else initializeGoogle();
    };

    const initializeGoogle = () => {
      /* global google */
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID", // ⚠️ Replace with your ID
          callback: handleGoogleLogin,
        });

        google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large", width: 300 }
        );
      }
    };

    const handleGoogleLogin = async (response) => {
      try {
        const res = await API.post("/auth/google", { idToken: response.credential });
        localStorage.setItem("token", res.data.token); // assuming backend returns { token, email, name }

        // Fill in form with Google data & mark as verified
        setFormData({
          ...formData,
          email: res.data.email || "",
          username: res.data.name || "",
          phone: res.data.phone || "",
        });
        setEmailVerified(true);
        setPhoneVerified(true);
        setOtpSent(false);
        setGoogleMessage("🎉 Registered & logged in successfully via Google!");
        setMessage("");
      } catch (err) {
        setGoogleMessage(err.response?.data || "❌ Google login failed");
      }
    };

    loadGoogleScript();
  }, []);

  return (
    <div style={{ width: 420, margin: "auto", textAlign: "center" }}>
      <h2>Register Your Account</h2>

      {/* FORM */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        disabled={otpSent || googleMessage}
      /><br /><br />

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        disabled={otpSent || googleMessage}
      /><br /><br />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        disabled={otpSent || googleMessage}
      /><br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        disabled={otpSent || googleMessage}
      /><br /><br />

      {/* BUTTONS */}
      {!otpSent && !googleMessage && <button onClick={sendOtp}>Send OTP</button>}
      <button onClick={resetForm} style={{ marginLeft: 10 }}>Reset</button>

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
            onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
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
            onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
          />
        </>
      )}

      {/* FINAL SUCCESS */}
      {(emailVerified && phoneVerified || googleMessage) && (
        <h3 style={{ color: "green" }}>🎉 Registration Completed Successfully</h3>
      )}

      {/* 🌐 Google Button at BOTTOM */}
      <div style={{ marginTop: 30 }}>
        <p>Or continue with Google</p>
        <div id="google-login-button"></div>
        {googleMessage && <p style={{ color: "green" }}>{googleMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterForm;
