import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sellerApi from "../../api/sellerApi";
import SellerLayout from "../../layouts/SellerLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sellerApi.getProductListing();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2>My Products</h2>

        <div className="row">
          {products.map((p) => (
            <div
              key={p.productId}
              className="col-md-4 mb-4"
              onClick={() => navigate(`/products/${p.productId}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "200px",
                      background: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#888",
                    }}
                  >
                    No Image
                  </div>
                )}

                <div className="card-body">
                  <h5>{p.name}</h5>
                  <p>₹{p.price ?? 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
};

export default Products;
