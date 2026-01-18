import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import sellerApi from "../api/sellerApi";
import SellerLayout from "../layouts/SellerLayout";

/* ---------- SKU → ATTRIBUTES (INTERNAL ONLY) ---------- */
const parseSku = (sku) => {
  if (!sku) return {};
  const [colorCode, purity, size] = sku.split("-");
  return {
    color:
      colorCode === "YEL"
        ? "Yellow"
        : colorCode === "WHI"
        ? "White"
        : colorCode === "ROS"
        ? "Rose"
        : colorCode,
    purity,
    size: Number(size),
  };
};

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPurity, setSelectedPurity] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [mainImage, setMainImage] = useState("/placeholder.png");
  const [variantImages, setVariantImages] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD PRODUCT ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await sellerApi.getProductPage(productId);

        setProduct(data || {});
        const productVariants = data?.variants || [];

        // 🔹 Normalize variants (SKU → attributes)
        const formattedVariants = productVariants.map(v => ({
          ...v,
          ...parseSku(v.sku),
          inStock: v.inStock ?? true,
        }));

        setVariants(formattedVariants);

        setVariantImages(data?.images || []);
        setMainImage(data?.images?.[0]?.imageUrl || "/placeholder.png");
      } catch (e) {
        console.error("Failed to load product page", e);
        setProduct({});
      } finally {
        setLoading(false);
      }
    };

    if (productId) load();
  }, [productId]);

  /* ---------- IMAGE FILTER ---------- */
  const updateImagesForVariant = (variantId) => {
    const filtered = (product?.images || []).filter(
      img => !img.variantId || img.variantId === variantId
    );
    setVariantImages(filtered);
    setMainImage(filtered?.[0]?.imageUrl || "/placeholder.png");
  };

  /* ---------- ATTRIBUTE OPTIONS ---------- */
  const colors = useMemo(
    () => [...new Set(variants.map(v => v.color).filter(Boolean))],
    [variants]
  );

  const purities = useMemo(
    () => [...new Set(variants.map(v => v.purity).filter(Boolean))],
    [variants]
  );

  const sizes = useMemo(
    () => [...new Set(variants.map(v => v.size).filter(Boolean))],
    [variants]
  );

  /* ---------- FIND MATCHING VARIANT ---------- */
  useEffect(() => {
    const match = variants.find(
      v =>
        v.color === selectedColor &&
        v.purity === selectedPurity &&
        v.size === selectedSize
    );

    setSelectedVariant(match || null);

    if (match) updateImagesForVariant(match.id);
  }, [selectedColor, selectedPurity, selectedSize, variants]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!product) return <div className="text-center mt-5">Product not found</div>;

  const lowestPrice =
    variants.reduce((min, v) => (v.price < min ? v.price : min), Infinity) || 0;

  let manufacturer = "N/A";
  try {
    manufacturer =
      JSON.parse(product.manufacturerInfo?.content || "{}")?.manufacturer ||
      "N/A";
  } catch {}

  return (
    <SellerLayout>
      <div className="container mt-4">

        <h2 className="text-gold">{product.name}</h2>
        <p className="text-muted">{product.description}</p>
        <p><strong>Brand:</strong> {product.brandName}</p>

        <div className="row mt-4">
          {/* ---------- IMAGES ---------- */}
          <div className="col-md-5">
            <img
              src={mainImage}
              className="img-fluid rounded border"
              alt={product.name}
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
            <div className="d-flex mt-2 flex-wrap">
              {variantImages.map(img => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  className="img-thumbnail me-2 mb-2"
                  style={{ width: 60, height: 60, cursor: "pointer" }}
                  onClick={() => setMainImage(img.imageUrl)}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* ---------- DETAILS ---------- */}
          <div className="col-md-7">
            <h4 className="price">
              ₹{selectedVariant?.price || lowestPrice}
            </h4>

            {/* COLOR */}
            <h6 className="mt-3">Color</h6>
            {colors.map(c => (
              <button
                key={c}
                className={`category-btn me-2 ${
                  selectedColor === c ? "selected" : ""
                }`}
                onClick={() => setSelectedColor(c)}
              >
                {c}
              </button>
            ))}

            {/* PURITY */}
            <h6 className="mt-3">Purity</h6>
            {purities.map(p => (
              <button
                key={p}
                className={`category-btn me-2 ${
                  selectedPurity === p ? "selected" : ""
                }`}
                onClick={() => setSelectedPurity(p)}
              >
                {p}
              </button>
            ))}

            {/* SIZE */}
            <h6 className="mt-3">Ring Size</h6>
            {sizes.map(s => (
              <button
                key={s}
                className={`category-btn me-2 ${
                  selectedSize === s ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}

            {/* AVAILABILITY */}
            {selectedVariant && (
              <p
                className={`mt-2 fw-bold ${
                  selectedVariant.inStock ? "text-success" : "text-danger"
                }`}
              >
                {selectedVariant.inStock ? "Available" : "Out of Stock"}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-4">
              <button
                className="btn-buy me-2"
                disabled={!selectedVariant?.inStock}
              >
                Add to Cart
              </button>
              <button
                className="btn-gold"
                disabled={!selectedVariant?.inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* ---------- FEATURES ---------- */}
        {product.features?.length > 0 && (
          <div className="mt-5">
            <h4 className="text-gold">Jewelry Highlights</h4>
            <ul>
              {product.features.map(f => (
                <li key={f.id}>{f.feature || f.content}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- SPECIFICATIONS ---------- */}
        {product.specifications?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-gold">Jewelry Details</h4>
            <ul>
              {product.specifications.map(s => (
                <li key={s.id}>
                  <strong>{s.specKey}:</strong> {s.specValue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- MANUFACTURER ---------- */}
        <div className="mt-4">
          <h4 className="text-gold">From Manufacturer</h4>
          <p>{manufacturer}</p>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ProductDetailsPage;
