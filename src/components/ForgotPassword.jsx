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
      setMessage(err.response?.data || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 rounded">
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </form>
  );
};

export default ForgotPassword;


