import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import sellerApi from "../api/sellerApi";
import SellerLayout from "../layouts/SellerLayout";
import { useCart } from "../context/CartContext.jsx";

/* ---------- SKU → ATTRIBUTES ---------- */
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
    size: size ? Number(size) : null,
  };
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPurity, setSelectedPurity] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [mainImage, setMainImage] = useState("/placeholder.png");
  const [selectedImage, setSelectedImage] = useState("/placeholder.png");
  const [variantImages, setVariantImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  /* ---------- LOAD PRODUCT ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await sellerApi.getProductPage(productId);

        const formattedVariants = (data?.variants || []).map((v) => ({
          ...v,
          ...parseSku(v.sku),
          inStock: v.inStock ?? true,
          discountPercent: v.discountPercent || 0, // use uploaded discount
        }));

        setProduct(data || {});
        setVariants(formattedVariants);

        setVariantImages(data?.images || []);
        setMainImage(data?.images?.[0]?.imageUrl || "/placeholder.png");
        setSelectedImage(data?.images?.[0]?.imageUrl || "/placeholder.png");
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
      (img) => !img.variantId || img.variantId === variantId
    );
    setVariantImages(filtered);
    setMainImage(filtered?.[0]?.imageUrl || "/placeholder.png");
    setSelectedImage(filtered?.[0]?.imageUrl || "/placeholder.png");
  };

  /* ---------- OPTIONS ---------- */
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))],
    [variants]
  );
  const purities = useMemo(
    () => [...new Set(variants.map((v) => v.purity).filter(Boolean))],
    [variants]
  );
  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))],
    [variants]
  );

  const hasColor = colors.length > 0;
  const hasPurity = purities.length > 0;
  const hasSize = sizes.length > 0;

  /* ---------- MATCH VARIANT ---------- */
  useEffect(() => {
    if (
      (hasColor && !selectedColor) ||
      (hasPurity && !selectedPurity) ||
      (hasSize && !selectedSize)
    ) {
      setSelectedVariant(null);
      return;
    }

    const match = variants.find(
      (v) =>
        (!hasColor || v.color === selectedColor) &&
        (!hasPurity || v.purity === selectedPurity) &&
        (!hasSize || Number(v.size) === Number(selectedSize))
    );

    setSelectedVariant(match || null);

    if (match) updateImagesForVariant(match.id);
  }, [
    selectedColor,
    selectedPurity,
    selectedSize,
    variants,
    hasColor,
    hasPurity,
    hasSize,
  ]);

  /* ---------- FLAGS ---------- */
  const isUnavailable =
    (hasColor || hasPurity || hasSize) && !selectedVariant;

  const lowestPrice =
    variants.reduce((min, v) => (v.price < min ? v.price : min), Infinity) || 0;

  let manufacturer = "N/A";
  try {
    manufacturer =
      JSON.parse(product.manufacturerInfo?.content || "{}")?.manufacturer ||
      "N/A";
  } catch {}

  /* ---------- IMAGE EFFECTS ---------- */
  const handleHoverImage = (imageUrl) => {
    setFade(true);
    setTimeout(() => {
      setMainImage(imageUrl);
      setFade(false);
    }, 150);
  };

  const handleLeaveImage = () => {
    handleHoverImage(selectedImage);
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setMainImage(imageUrl);
  };

  /* ---------- ADD TO CART ---------- */
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Selected combination is unavailable");
      return;
    }

    if (!selectedVariant.inStock) {
      alert("Selected variant is out of stock");
      return;
    }

    addToCart({
      productId: Number(productId),
      variantId: selectedVariant.id,
      quantity: 1,
    });
  };

  /* ---------- DISCOUNT LOGIC ---------- */
 /* ---------- DISCOUNT LOGIC ---------- */
const getDiscountedPrice = (variant) => {
  if (!variant) return 0;

  const mrp = Number(variant.price?.mrp || 0);
  const discountType = variant.discount?.discountType || "PERCENT";
  const discountValue = Number(variant.discount?.discountValue || 0);

  let sp = mrp;

  if (discountType === "PERCENT") sp -= (sp * discountValue) / 100;
  else if (discountType === "FIXED") sp -= discountValue;

  return sp < 0 ? 0 : sp;
};

const discountedPrice = selectedVariant
  ? getDiscountedPrice(selectedVariant)
  : lowestPrice;

const originalPrice = selectedVariant?.price?.mrp || lowestPrice;

const discountPercent =
  selectedVariant?.discount?.discountType === "PERCENT"
    ? selectedVariant.discount.discountValue
    : selectedVariant?.price?.mrp
    ? Math.round(
        ((selectedVariant.price.mrp - discountedPrice) / selectedVariant.price.mrp) *
          100
      )
    : 0;

const isDiscounted = discountPercent > 0;


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!product) return <div className="text-center mt-5">Product not found</div>;

  return (
    <SellerLayout>
      <div className="container mt-4">
        <h2 className="text-gold">{product.name}</h2>
        <p className="text-muted">{product.description}</p>
        <p><strong>Brand:</strong> {product.brandName}</p>

        <div className="row mt-4">
          {/* IMAGES */}
          <div className="col-md-5">
            <img
              src={mainImage}
              className={`img-fluid main-image ${fade ? "fade" : ""}`}
              alt={product.name}
            />
            <div className="d-flex mt-2 flex-wrap">
              {variantImages.map((img) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  className="img-thumbnail me-2 mb-2"
                  style={{ width: 60, height: 60, cursor: "pointer" }}
                  onMouseEnter={() => handleHoverImage(img.imageUrl)}
                  onMouseLeave={handleLeaveImage}
                  onClick={() => handleSelectImage(img.imageUrl)}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="col-md-7">
            {/* ---------- PRICING ---------- */}
            {selectedVariant ? (
              isDiscounted ? (
                <h4 className="price">
                  <span
                    className="text-muted"
                    style={{ textDecoration: "line-through", marginRight: "8px" }}
                  >
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="fw-bold" style={{ marginRight: "8px" }}>
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-success">({discountPercent}% off)</span>
                </h4>
              ) : (
                <h4 className="price fw-bold">₹{originalPrice.toLocaleString()}</h4>
              )
            ) : (
              <h4 className="price fw-bold">Starting from ₹{lowestPrice.toLocaleString()}</h4>
            )}

            {/* ---------- OPTIONS ---------- */}
            {colors.length > 0 && (
              <>
                <h6 className="mt-3">Color</h6>
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`category-btn me-2 ${selectedColor === c ? "selected" : ""}`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </>
            )}

            {purities.length > 0 && (
              <>
                <h6 className="mt-3">Purity</h6>
                {purities.map((p) => (
                  <button
                    key={p}
                    className={`category-btn me-2 ${selectedPurity === p ? "selected" : ""}`}
                    onClick={() => setSelectedPurity(p)}
                  >
                    {p}
                  </button>
                ))}
              </>
            )}

            {sizes.length > 0 && (
              <>
                <h6 className="mt-3">Ring Size</h6>
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`category-btn me-2 ${selectedSize === s ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </>
            )}

            {isUnavailable && (
              <p className="mt-2 fw-bold text-danger">
                Unavailable for selected combination
              </p>
            )}

            {selectedVariant && (
              <p className={`mt-2 fw-bold ${selectedVariant.inStock ? "text-success" : "text-danger"}`}>
                {selectedVariant.inStock ? "Available" : "Out of Stock"}
              </p>
            )}

            <div className="mt-4">
              <button
                className="btn-buy me-2"
                disabled={!selectedVariant || !selectedVariant.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="btn-gold"
                disabled={!selectedVariant || !selectedVariant.inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        {product.features?.length > 0 && (
          <div className="mt-5">
            <h4 className="text-gold">Jewelry Highlights</h4>
            <ul>
              {product.features.map((f) => (
                <li key={f.id}>{f.feature || f.content}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SPECIFICATIONS */}
        {product.specifications?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-gold">Jewelry Details</h4>
            <ul>
              {product.specifications.map((s) => (
                <li key={s.id}>
                  <strong>{s.specKey}:</strong> {s.specValue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MANUFACTURER */}
        <div className="mt-4">
          <h4 className="text-gold">From Manufacturer</h4>
          <p>{manufacturer}</p>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ProductDetailsPage;
