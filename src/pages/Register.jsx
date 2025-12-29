import { useState } from "react";
import { authController } from "../components/authController";
import GoogleLoginButton from "../components/GoogleLoginButton"; 

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState({ emailOtp: "", phoneOtp: "" });
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: Verify OTPs
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Track verification status
  const [verified, setVerified] = useState({ email: false, phone: false });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp({ ...otp, [e.target.name]: e.target.value });
  };

  // Submit registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await authController.register(form);
      setMessage(res); 
      setStep(2); // Move to OTP verification
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify email OTP
  const handleVerifyEmail = async () => {
    setLoading(true);
    setMessage("");
    try {
      await authController.verifyEmailOtp(form.email, otp.emailOtp);
      setVerified((prev) => ({ ...prev, email: true }));
      setMessage("Email verified!");
    } catch (err) {
      setMessage(err.response?.data || "Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify phone OTP
  const handleVerifyPhone = async () => {
    setLoading(true);
    setMessage("");
    try {
      await authController.verifyPhoneOtp(form.phone, otp.phoneOtp);
      setVerified((prev) => ({ ...prev, phone: true }));
      setMessage("Phone verified!");
    } catch (err) {
      setMessage(err.response?.data || "Phone verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 rounded w-full"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500 font-semibold">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <GoogleLoginButton />
          </form>
        </>
      ) : verified.email && verified.phone ? (
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Registration Successful! You can now login.
        </h2>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Verify OTPs</h2>
          <div className="flex flex-col gap-3">
            <div>
              <input
                type="text"
                name="emailOtp"
                placeholder="Email OTP"
                value={otp.emailOtp}
                onChange={handleOtpChange}
                className="border p-2 rounded"
              />
              <button
                onClick={handleVerifyEmail}
                disabled={loading || verified.email}
                className={`py-1 px-2 ml-2 rounded ${
                  verified.email ? "bg-gray-400" : "bg-green-500 text-white"
                }`}
              >
                {verified.email ? "Verified" : "Verify Email"}
              </button>
            </div>
            <div>
              <input
                type="text"
                name="phoneOtp"
                placeholder="Phone OTP"
                value={otp.phoneOtp}
                onChange={handleOtpChange}
                className="border p-2 rounded"
              />
              <button
                onClick={handleVerifyPhone}
                disabled={loading || verified.phone}
                className={`py-1 px-2 ml-2 rounded ${
                  verified.phone ? "bg-gray-400" : "bg-green-500 text-white"
                }`}
              >
                {verified.phone ? "Verified" : "Verify Phone"}
              </button>
            </div>
          </div>
        </>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default Register;
