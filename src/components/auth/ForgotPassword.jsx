import { useState } from "react";
import { sendOtp, validateOtp, resetPassword } from "../../services/AuthService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    const text = await sendOtp(email);
    setMessage(text);
    setStep(2);
  };

  const handleResetPassword = async () => {
    const isValid = await validateOtp(userId, otp);
    if (!isValid) return setMessage("Invalid or expired OTP");
    const text = await resetPassword(userId, newPassword);
    setMessage(text);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h3>Forgot Password</h3>
      {message && <p>{message}</p>}
      {step === 1 && (
        <>
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br /><br />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}
      {step === 2 && (
        <>
          <input type="number" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <br /><br />
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <br /><br />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <br /><br />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
