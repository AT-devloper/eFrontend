import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sellerApi from "../api/sellerApi";
import SellerLayout from "../layouts/SellerLayout";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("/placeholder.png");
  const [variantImages, setVariantImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sellerApi.getProductPage(productId);
        console.log("Product Data:", data);

        setProduct(data || {});
        setVariants(data?.variants || []);

        if (data?.variants?.length > 0) {
          const firstVariant = data.variants[0];
          setSelectedVariant(firstVariant);
          updateImagesForVariant(data.images || [], firstVariant.id);
        } else {
          setVariantImages(data.images || []);
          setMainImage(data.images?.[0]?.imageUrl || "/placeholder.png");
        }
      } catch (e) {
        console.error("Failed to load product page", e);
        setProduct({});
      } finally {
        setLoading(false);
      }
    };

    if (productId) load();
  }, [productId]);

  const updateImagesForVariant = (allImages, variantId) => {
    const filtered = allImages.filter(
      (img) => !img.variantId || img.variantId === variantId
    );
    setVariantImages(filtered);
    setMainImage(filtered?.[0]?.imageUrl || "/placeholder.png");
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    updateImagesForVariant(product.images || [], variant.id);
  };

  if (loading)
    return <div className="text-center mt-5">Loading...</div>;

  if (!product || Object.keys(product).length === 0)
    return <div className="text-center mt-5">Product not found</div>;

  let manufacturer = "N/A";
  try {
    manufacturer =
      JSON.parse(product.manufacturerInfo?.content || "{}")?.manufacturer ||
      "N/A";
  } catch (e) {
    console.error("Failed to parse manufacturerInfo", e);
  }

  return (
    <SellerLayout>
      <div className="container mt-4">
        {/* TITLE */}
        <h2 className="text-gold">{product.name || "Unnamed Product"}</h2>
        <p className="text-muted">{product.description || "No description"}</p>
        <p>
          <strong>Brand:</strong> {product.brandName || "Unknown Brand"}
        </p>

        {/* CATEGORY */}
        {product.breadcrumb?.length > 0 && (
          <p className="seller-breadcrumb">
            <strong>Category:</strong>{" "}
            {product.breadcrumb.map((b) => b.name).join(" > ")}
          </p>
        )}

        <div className="row mt-4">
          {/* IMAGES */}
          <div className="col-md-5">
            <div className="seller-card">
              <img
                src={mainImage}
                className="img-fluid rounded border"
                alt={product.name}
                style={{ maxHeight: 400, objectFit: "contain" }}
              />
              <div className="d-flex mt-2 flex-wrap">
                {variantImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    className="img-thumbnail me-2 mb-2"
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                    alt="Product"
                    onClick={() => setMainImage(img.imageUrl)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid var(--gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.border = "2px solid transparent")
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="col-md-7">
            <h4 className="price">₹{selectedVariant?.price || 0}</h4>

            {/* VARIANTS */}
            {variants.length > 0 && (
              <>
                <h6 className="mt-3">Available Variants</h6>
                <div className="d-flex flex-wrap">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className={`category-btn me-2 mb-2 ${
                        selectedVariant?.id === v.id ? "selected" : ""
                      }`}
                      onClick={() => handleVariantSelect(v)}
                    >
                      {v.sku} – ₹{v.price || 0}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4">
              <button className="btn-buy me-2">Add to Cart</button>
              <button className="btn-gold">Buy Now</button>
            </div>
          </div>
        </div>

        {/* JEWELRY HIGHLIGHTS */}
        {product.features?.length > 0 && (
          <div className="mt-5">
            <h4 className="text-gold">Jewelry Highlights</h4>
            <ul>
              {product.features.map((f) => (
                <li key={f.id}>{f.feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* JEWELRY DETAILS */}
        {product.specifications?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-gold">Jewelry Details</h4>
            <ul>
              {product.specifications
                .filter((s) => s.specKey && s.specValue)
                .map((s) => (
                  <li key={s.id}>
                    <strong>{s.specKey}:</strong> {s.specValue}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* MANUFACTURER INFO */}
        {manufacturer && (
          <div className="mt-4">
            <h4 className="text-gold">From Manufacturer</h4>
            <p>{manufacturer}</p>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default ProductDetailsPage;
