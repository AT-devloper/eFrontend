import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sellerApi from "../../api/sellerApi";
import SellerLayout from "../../layouts/SellerLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sellerApi.getProductListing();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to load products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <SellerLayout>
        <div className="text-center mt-5">Loading products...</div>
      </SellerLayout>
    );
  }

  if (!products.length) {
    return (
      <SellerLayout>
        <div className="text-center mt-5">No products uploaded yet</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2 className="mb-4">My Uploaded Products</h2>
        <div className="row">
          {products.map((p, index) => {
            const key = p.productId ?? index;
            const imageUrl =
              p.image && p.image !== "/placeholder.png" ? p.image : null;

            return (
              <div
                key={key}
                className="col-md-4 mb-4"
                onClick={() => navigate(`/seller/products/${p.productId}`)} // Navigate on click
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name || "Product"}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{p.name || "No Name"}</h5>
                    <p className="card-text">
                      <strong>Brand:</strong> {p.brand || "Unknown Brand"}
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ₹{p.price ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SellerLayout>
  );
};

export default Products;
