import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import AuthToggleCard from "../components/AuthToggleCard";
import ProductListPage from "../pages/ProductListPage";
// Import Seller page
import CreateProductPage from "../components/seller/CreateProductPages";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect default "/" to "/home" */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthToggleCard />} />

      {/* Seller page */}
      <Route path="/seller/create-product" element={<CreateProductPage />} />

      <Route path="/seller/products" element={<ProductListPage />} /> 
      {/* Catch all - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
