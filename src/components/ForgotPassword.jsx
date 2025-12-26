import { useState } from "react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // STEP 1: Send OTP
  const sendOtp = async () => {
    const res = await fetch(
      `/auth/forgot-password/send-otp?email=${email}`,
      { method: "POST" }
    );
    const text = await res.text();
    setMessage(text);
    setStep(2);
  };

  // STEP 2: Validate OTP + Reset Password
  const resetPassword = async () => {
    const otpRes = await fetch(
      `/auth/forgot-password/validate-otp?userId=${userId}&otp=${otp}`,
      { method: "POST" }
    );

    if (!otpRes.ok) {
      setMessage("Invalid or expired OTP");
      return;
    }

    const resetRes = await fetch(
      `/auth/forgot-password/reset-password?userId=${userId}&newPassword=${newPassword}`,
      { method: "POST" }
    );

    const text = await resetRes.text();
    setMessage(text);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Forgot Password</h3>

      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <br /><br />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
