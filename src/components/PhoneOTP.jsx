import React, { useState, useEffect } from "react";
import API from "../API Configuration/api";

const PhoneOTP = ({ phone, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Send OTP to phone
  const sendPhoneOtp = async () => {
    try {
      await API.post("/auth/send-phone-otp", null, { params: { phone } });
      setMsg("Phone OTP sent!");
    } catch {
      setMsg("Failed to send Phone OTP");
    }
  };

  // Auto verify when 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      verifyPhoneOtp();
    }
  }, [otp]);

  // Verify OTP
  const verifyPhoneOtp = async () => {
    try {
      const res = await API.post("/auth/verify/phone", null, {
        params: { phone, otp },
      });
      setMsg(res.data);
      setPhoneVerified(true);
      if (onVerified) onVerified(); // notify parent
    } catch {
      setMsg("Invalid Phone OTP");
    }
  };

  return (
    <div>
      <h4>Phone Verification</h4>
      {phoneVerified ? (
        <p>✅ Phone Verified</p>
      ) : (
        <>
          <button onClick={sendPhoneOtp}>Send Phone OTP</button><br /><br />
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
