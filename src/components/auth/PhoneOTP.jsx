import React, { useState, useEffect } from "react";
import { sendPhoneOtp, verifyPhoneOtp } from "../../services/AuthService";

const PhoneOTP = ({ phone, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleSendOtp = async () => {
    try {
      await sendPhoneOtp(phone);
      setMsg("Phone OTP sent!");
    } catch {
      setMsg("Failed to send Phone OTP");
    }
  };

  useEffect(() => {
    if (otp.length === 6) handleVerifyOtp();
  }, [otp]);

  const handleVerifyOtp = async () => {
    try {
      await verifyPhoneOtp(phone, otp);
      setPhoneVerified(true);
      setMsg("✅ Phone Verified");
      if (onVerified) onVerified();
    } catch {
      setMsg("❌ Invalid Phone OTP");
      setOtp("");
    }
  };

  return (
    <div>
      <h4>Phone Verification</h4>
      {phoneVerified ? (
        <p>✅ Phone Verified</p>
      ) : (
        <>
          <button onClick={handleSendOtp}>Send Phone OTP</button><br /><br />
          <input
            type="text"
            placeholder="Enter Phone OTP"
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

export default PhoneOTP;
