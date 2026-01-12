import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";
import SellerLayout from "../../layouts/SellerLayout";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await sellerApi.getProductListing();
      setProducts(Array.isArray(data) ? data : []);
    };
    fetchProducts();
  }, []);

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2>My Products</h2>

        {products.map((p) => (
          <div key={p.productId}>
            {p.name} – ₹{p.price}
          </div>
        ))}
      </div>
    </SellerLayout>
  );
};

export default ProductListPage;   // ✅ THIS LINE IS REQUIRED
