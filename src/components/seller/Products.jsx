import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";
import SellerLayout from "../../layouts/SellerLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [imagesMap, setImagesMap] = useState({}); // store productId => thumbnailUrl

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await sellerApi.getProductListing();
        const productsWithUniqueId = Array.isArray(res.data)
          ? res.data.map((p, index) => ({ ...p, id: p.id || `dev-${index}-${Date.now()}` }))
          : [];
        setProducts(productsWithUniqueId);

        // fetch images for each product
        const imagesPromises = productsWithUniqueId.map(async (p) => {
          try {
            const imgRes = await sellerApi.getProductImages(p.id);
            const primaryImg = imgRes.data.find((img) => img.isPrimary) || imgRes.data[0];
            return [p.id, primaryImg?.imageUrl || ""];
          } catch (err) {
            console.error("Failed to fetch images for product", p.id, err);
            return [p.id, ""];
          }
        });

        const imagesArray = await Promise.all(imagesPromises);
        const map = Object.fromEntries(imagesArray);
        setImagesMap(map);

      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  if (!products.length) return <div className="text-center mt-5">No products found</div>;

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2 className="mb-4">My Products</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-3">
              <div className="card h-100">
                {imagesMap[product.id] && (
                  <img
                    src={imagesMap[product.id]}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ${product.price || 0}</p>
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
