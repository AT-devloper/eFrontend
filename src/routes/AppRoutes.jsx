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

// 1. Uncomment the import
import Wishlist from "../pages/Wishlist"; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect default "/" to "/home" */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetailsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthToggleCard />} />

      {/* Cart, Orders & Wishlist */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/my-orders/:orderNumber" element={<OrderDetail />} />
      
      {/* 2. Uncomment the Route */}
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Seller pages */}
      <Route path="/productlist/createproduct" element={<CreateProductPage />} />
      <Route path="/product/products" element={<ProductListPage />} />

      {/* Catch all - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}