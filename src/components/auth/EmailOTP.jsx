import React, { useState, useEffect } from "react";
import { sendEmailOtp, verifyEmailOtp } from "../../services/AuthService";

const EmailOTP = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleSendOtp = async () => {
    try {
      await sendEmailOtp(email);
      setMsg("Email OTP sent!");
    } catch {
      setMsg("Failed to send Email OTP");
    }
  };

  useEffect(() => {
    if (otp.length === 6) handleVerifyOtp();
  }, [otp]);

  const handleVerifyOtp = async () => {
    try {
      await verifyEmailOtp(email, otp);
      setEmailVerified(true);
      setMsg("✅ Email Verified");
      if (onVerified) onVerified();
    } catch {
      setMsg("❌ Invalid Email OTP");
      setOtp("");
    }
  };

  return (
    <div>
      <h4>Email Verification</h4>
      {emailVerified ? (
        <p>✅ Email Verified</p>
      ) : (
        <>
          <button onClick={handleSendOtp}>Send Email OTP</button><br /><br />
          <input
            type="text"
            placeholder="Enter Email OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </>
      )}
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default EmailOTP;
