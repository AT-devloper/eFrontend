import React, { useState, useEffect } from "react";
import API from "../API/axiosInstance";

const EmailOTP = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // Send OTP to email
  const sendEmailOtp = async () => {
    try {
      await API.post("/auth/send-email-otp", null, { params: { email } });
      setMsg("Email OTP sent!");
    } catch {
      setMsg("Failed to send Email OTP");
    }
  };

  // Auto verify when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      verifyEmailOtp();
    }
  }, [otp]);

  // Verify OTP
  const verifyEmailOtp = async () => {
    try {
      const res = await API.post("/auth/verify/email", null, {
        params: { email, otp },
      });
      setMsg(res.data);
      setEmailVerified(true);
      if (onVerified) onVerified(); // notify parent
    } catch {
      setMsg("Invalid Email OTP");
    }
  };

  return (
    <div>
      <h4>Email Verification</h4>
      {emailVerified ? (
        <p>✅ Email Verified</p>
      ) : (
        <>
          <button onClick={sendEmailOtp}>Send Email OTP</button><br /><br />
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
