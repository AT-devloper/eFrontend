import React, { useState, useEffect } from "react";
import { registerUser, googleLogin } from "../../services/AuthService";
import EmailOTP from "./EmailOTP";
import PhoneOTP from "./PhoneOTP";

const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: "", username: "", phone: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [googleMessage, setGoogleMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    try {
      await registerUser(formData);
      setOtpSent(true);
      setMessage("📨 OTP sent to Email & Phone");
    } catch (err) {
      setMessage(err.response?.data || "❌ Failed to send OTP");
    }
  };

  // Google login
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById("google-js")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.id = "google-js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initGoogle;
      } else initGoogle();
    };

    const initGoogle = () => {
      /* global google */
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID",
          callback: async (response) => {
            try {
              const res = await googleLogin(response.credential);
              localStorage.setItem("token", res.token);
              setFormData({ email: res.email || "", username: res.name || "", phone: res.phone || "" });
              setEmailVerified(true);
              setPhoneVerified(true);
              setOtpSent(false);
              setGoogleMessage("🎉 Registered & logged in via Google!");
            } catch {
              setGoogleMessage("❌ Google login failed");
            }
          },
        });
        google.accounts.id.renderButton(document.getElementById("google-login-button"), { theme: "outline", size: "large", width: 300 });
      }
    };

    loadGoogleScript();
  }, []);

  return (
    <div style={{ width: 420, margin: "auto", textAlign: "center" }}>
      <h2>Register Your Account</h2>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={otpSent || googleMessage} /><br /><br />
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} disabled={otpSent || googleMessage} /><br /><br />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} disabled={otpSent || googleMessage} /><br /><br />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} disabled={otpSent || googleMessage} /><br /><br />

      {!otpSent && !googleMessage && <button onClick={handleSendOtp}>Send OTP</button>}
      <button onClick={() => setFormData({ email: "", username: "", phone: "", password: "" })} style={{ marginLeft: 10 }}>Reset</button>

      {otpSent && !emailVerified && <EmailOTP email={formData.email} onVerified={() => setEmailVerified(true)} />}
      {otpSent && !phoneVerified && <PhoneOTP phone={formData.phone} onVerified={() => setPhoneVerified(true)} />}

      {(emailVerified && phoneVerified || googleMessage) && <h3 style={{ color: "green" }}>🎉 Registration Completed Successfully</h3>}

      <div style={{ marginTop: 30 }}>
        <p>Or continue with Google</p>
        <div id="google-login-button"></div>
        {googleMessage && <p style={{ color: "green" }}>{googleMessage}</p>}
      </div>

      <p>{message}</p>
    </div>
  );
};

export default RegisterForm;
