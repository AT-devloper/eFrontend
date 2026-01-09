import React, { useEffect, useState } from "react";
import sellerApi from "../api/sellerApi";
import SellerLayout from "../layouts/SellerLayout";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await sellerApi.getProductListing();
        console.log("Products fetched:", res.data);

        if (Array.isArray(res.data)) {
          // Map each product to include correct fields and unique IDs
          const uniqueProducts = res.data.map((p, index) => {
            // Get primary image from backend or fallback
            let thumbnail = "";
            if (p.images && p.images.length > 0) {
              const primary = p.images.find(img => img.isPrimary);
              thumbnail = primary ? primary.imageUrl : p.images[0].imageUrl;
            }

            return {
              id: p.id || `dev-${index}-${Date.now()}`,
              name: p.name || "No Name",
              price: p.price || 0,
              slug: p.slug || "",
              thumbnailUrl: thumbnail,
            };
          });

          setProducts(uniqueProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]); // fallback empty
      }
    };

    fetchProducts();
  }, []);

  if (!products.length) {
    return <div className="text-center mt-5">No products found</div>;
  }

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2 className="mb-4">My Products</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-3">
              <div className="card h-100">
                {product.thumbnailUrl ? (
                  <img
                    src={product.thumbnailUrl}
                    className="card-img-top"
                    alt={product.name}
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
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ${product.price}</p>
                  {product.slug && (
                    <a
                      href={`/product/${product.slug}`}
                      className="btn btn-primary mt-auto"
                    >
                      View Product
                    </a>
                  )}
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
