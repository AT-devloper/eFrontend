import { Navigate, Routes, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/forgot-password" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
