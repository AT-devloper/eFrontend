
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Products from "../pages/Products";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
};

export default AppRoutes;
