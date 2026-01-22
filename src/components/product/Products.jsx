import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sellerApi from "../../api/sellerApi";
import SellerLayout from "../../layouts/SellerLayout";
import { useCart } from "../../context/CartContext.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sellerApi.getProductListing();

        // ⚠️ Ensure each product has variants
        const normalized = data.map(p => ({
          ...p,
          image: "/placeholder.png",
          variants: p.variants || [] // ✅ enforce array
        }));

        setProducts(normalized);

        const imagesData = await Promise.all(
          normalized.map(p =>
            sellerApi
              .getProductImages(p.productId)
              .then(images => images[0]?.imageUrl || "/placeholder.png")
              .catch(() => "/placeholder.png")
          )
        );

        setProducts(prev =>
          prev.map((p, i) => ({ ...p, image: imagesData[i] }))
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    // ✅ STRICT variant check
    if (!product.variants.length) {
      alert("This product has no variants and cannot be added to cart");
      return;
    }

    const variantId = product.variants[0].id; // ✅ REAL variant ID

    try {
      await addToCart({
        productId: product.productId,
        variantId,
        quantity: 1,
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      alert("⚠️ Could not add to cart");
    }
  };

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2>My Products</h2>

        <div className="row">
          {products.length === 0 && (
            <div className="col-12 text-center mt-4">
              No products found.
            </div>
          )}

          {products.map(p => {
            const variantId = p.variants?.[0]?.id;
            const inCart =
              variantId &&
              cart.some(
                ci =>
                  ci.productId === p.productId &&
                  ci.variantId === variantId
              );

            return (
              <div
                key={p.productId}
                className="col-md-4 mb-4"
                onClick={() => navigate(`/products/${p.productId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        ₹{p.price?.toFixed(2) || "0.00"}
                      </p>
                      <p className="card-text text-muted">{p.brand}</p>
                    </div>

                    <button
                      className={`btn mt-2 ${
                        inCart ? "btn-secondary" : "btn-warning"
                      }`}
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={inCart || !variantId}
                    >
                      {!variantId
                        ? "Variant Missing"
                        : inCart
                        ? "Already in Cart"
                        : "Add to Cart"}
                    </button>
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
