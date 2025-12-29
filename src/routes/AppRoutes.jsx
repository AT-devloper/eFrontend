import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import AuthToggleCard from "../components/AuthToggleCard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect default "/" to "/home" */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthToggleCard />} />


      {/* Catch all - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
