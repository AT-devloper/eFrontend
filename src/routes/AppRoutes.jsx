import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../components/product/Products";

import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import AuthToggleCard from "../components/auth/AuthToggleCard";

// Import Seller page
import CreateProductPage from "../components/productliststeps/CreateProductPages";
import ProductListPage from "../components/product/ProductListPage";

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

      {/* Seller page */}
      <Route path="/product-steps/create-product" element={<CreateProductPage />} />

      <Route path="/product/products" element={<ProductListPage />} />
      {/* Catch all - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
