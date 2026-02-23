import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../components/product/Products";
import ProductDetailsPage from "../components/product/ProductDetailsPage";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import AuthToggleCard from "../components/auth/AuthToggleCard";
import CreateProductPage from "../components/productliststeps/CreateProductPages";
import ProductListPage from "../components/product/ProductListPage";
import MyOrders from "../pages/MyOrders";
import OrderDetail from "../pages/OrderDetail";
import Checkout from "../pages/Checkout";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";

// Admin Components
import AdminOrdersDashboard from "../admin/AdminOrdersDashboard";
import RbacPermissionPage from "../admin/RbacPermissionPage";
import AdminLayout from "../components/layout/AdminLayout";
import Roles from "../admin/Roles";
import AssignRole from "../admin/AssignRole";
import Permissions from "../admin/Permissions";

// NEW: Import the Welcome Component (or it's handled inside AdminLayout index)
// If you didn't create a separate file, the AdminLayout "isDefaultPage" logic 
// we wrote earlier will handle the "/" path automatically.
// AppRoutes.jsx
import VerifyOTP from "../components/auth/VerifyOtp"; // <-- create this file

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      {/* Public Pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetailsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthToggleCard />} />

      {/* NEW: OTP Verification */}
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* User Pages */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/my-orders/:orderNumber" element={<OrderDetail />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Seller Pages */}
      <Route path="/product/products" element={<ProductListPage />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={null} />
        <Route path="orders" element={<AdminOrdersDashboard />} />
        <Route path="sellerpannel" element={<CreateProductPage />} />
        <Route path="rbac/permissions" element={<RbacPermissionPage />} />
        <Route path="create/permissions" element={<Permissions />} />
        <Route path="create/roles" element={<Roles />} />
        <Route path="assign-role" element={<AssignRole />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}