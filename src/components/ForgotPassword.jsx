import { useState } from "react";
import { authController } from "./authController";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await authController.requestPasswordReset(email);
      setMessage("Reset link sent! Check your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", marginBottom: "1rem", color: "var(--maroon)" }}>
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("Failed") ? "#e74c3c" : "#2ecc71" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
