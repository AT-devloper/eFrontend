import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authController } from "../components/authController";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage("No token provided.");
        return;
      }
      try {
        await authController.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setMessage("Invalid or expired token.");
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await authController.resetPassword({ token, password });
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Failed to reset password.");
    }
  };

  if (!tokenValid) return <p>{message || "Validating token..."}</p>;

  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
};

export default ResetPassword;
