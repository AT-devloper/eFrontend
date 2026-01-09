import React, { useEffect, useState } from "react";
import sellerApi from "../api/sellerApi"; // adjust path if needed
import SellerLayout from "../components/layouts/SellerLayout";
import ProductCard from "../components/seller/ProductCard"; // optional if you want cards

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await sellerApi.getSellerProducts(); // you need this API in sellerApi
        setProducts(res);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <SellerLayout>
      <div className="container">
        <h3>Your Products</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerProductsPage;
