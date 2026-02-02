import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import sellerApi from "../../api/sellerApi.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx";
import { useCart } from "../../context/CartContext.jsx";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

/* ---------- SKU → ATTRIBUTES ---------- */
const parseSku = (sku) => {
  if (!sku) return {};
  const [colorCode, purity, size] = sku.split("-");
  const colorMap = { YEL: "Yellow", WHI: "White", ROS: "Rose" };
  return {
    color: colorMap[colorCode] || colorCode,
    purity,
    size: size ? size.toString() : null, // store as string
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

        // Map variants & include price & discount
        const formattedVariants = (data?.variants || []).map((v) => ({
          ...v,
          ...parseSku(v.sku),
          inStock: v.inStock ?? true,
          price: v.price || { mrp: 0, sellingPrice: 0 },
          discount: v.discount || { discountType: "PERCENT", discountValue: 0 },
        }));

        setProduct(data || {});
        setVariants(formattedVariants);

        const firstImage = data?.images?.[0]?.imageUrl || "/placeholder.png";
        setVariantImages(data?.images || []);
        setMainImage(firstImage);
        setSelectedImage(firstImage);
      } catch (e) {
        console.error("Failed to load product page", e);
        setProduct({});
      } finally {
        setLoading(false);
      }
    };

    if (productId) load();
  }, [productId]);

  /* ---------- OPTIONS ---------- */
  const colors = useMemo(() => [...new Set(variants.map(v => v.color).filter(Boolean))], [variants]);
  const purities = useMemo(() => [...new Set(variants.map(v => v.purity).filter(Boolean))], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map(v => v.size).filter(Boolean))].sort((a,b) => a-b), [variants]);

  /* ---------- DEFAULT VARIANT ---------- */
  useEffect(() => {
    if (!variants.length) return;

    const firstVariant = variants.find(v => v.inStock) || variants[0];
    if (!firstVariant) return;

    setSelectedColor(firstVariant.color);
    setSelectedPurity(firstVariant.purity);
    setSelectedSize(firstVariant.size);
    setSelectedVariant(firstVariant);

    updateImagesForVariant(firstVariant.id);
  }, [variants]);

  /* ---------- MATCH VARIANT ---------- */
  useEffect(() => {
    if (!variants.length) return;

    const match = variants.find(
      v =>
        (!colors.length || v.color === selectedColor) &&
        (!purities.length || v.purity === selectedPurity) &&
        (!sizes.length || v.size === selectedSize)
    );

    setSelectedVariant(match || null);
    if (match) updateImagesForVariant(match.id);
  }, [selectedColor, selectedPurity, selectedSize, variants]);

  /* ---------- IMAGE FILTER ---------- */
  const updateImagesForVariant = (variantId) => {
    const filtered = (product?.images || []).filter(
      img => !img.variantId || img.variantId === variantId
    );
    setVariantImages(filtered);
    const firstImg = filtered[0]?.imageUrl || "/placeholder.png";
    setMainImage(firstImg);
    setSelectedImage(firstImg);
  };

  /* ---------- IMAGE EFFECTS ---------- */
  const handleHoverImage = (imageUrl) => {
    setFade(true);
    setTimeout(() => {
      setMainImage(imageUrl);
      setFade(false);
    }, 150);
  };
  const handleLeaveImage = () => handleHoverImage(selectedImage);
  const handleSelectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setMainImage(imageUrl);
  };

  /* ---------- ADD TO CART ---------- */
  const handleAddToCart = () => {
    if (!selectedVariant) return alert("Selected combination is unavailable");
    if (!selectedVariant.inStock) return alert("Selected variant is out of stock");

    addToCart({
      productId: Number(productId),
      variantId: selectedVariant.id,
      quantity: 1,
      price: selectedVariant.price?.mrp || selectedVariant.price || 0,
    });
  };

  /* ---------- PRICE CALCULATION ---------- */
  const { discountedPrice, originalPrice, discountPercent } = useMemo(() => {
    if (!selectedVariant) return { discountedPrice: 0, originalPrice: 0, discountPercent: 0 };

    const mrp = Number(selectedVariant.price?.mrp ?? selectedVariant.price ?? 0);
    const discountType = selectedVariant.discount?.discountType || "PERCENT";
    const discountValue = Number(selectedVariant.discount?.discountValue || 0);

    let sp = mrp;
    if (discountType === "PERCENT") sp -= (sp * discountValue) / 100;
    else if (discountType === "FIXED") sp -= discountValue;

    const percent = discountType === "PERCENT"
      ? discountValue
      : mrp ? Math.round(((mrp - sp) / mrp) * 100) : 0;

    return { discountedPrice: sp < 0 ? 0 : sp, originalPrice: mrp, discountPercent: percent };
  }, [selectedVariant]);

  const isDiscounted = discountPercent > 0;
  const isUnavailable = !selectedVariant;

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (!product) return <Box textAlign="center" mt={5}><Typography>Product not found</Typography></Box>;

  let manufacturer = "N/A";
  try {
    manufacturer = JSON.parse(product.manufacturerInfo?.content || "{}")?.manufacturer || "N/A";
  } catch {}

  /* ---------- RENDER ---------- */
  return (
    <SellerLayout>
      <Box className="container" mt={4} sx={{ backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" color="primary">{product.name}</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>{product.description}</Typography>
        <Typography variant="body1" mt={1}><strong>Brand:</strong> {product.brandName}</Typography>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} mt={4}>
          {/* IMAGES */}
          <Box flex={1} mr={{ md: 2 }}>
            <Box component="img" src={mainImage} alt={product.name}
              sx={{ width: "100%", maxHeight: 400, objectFit: "contain", transition: "opacity 0.2s", opacity: fade ? 0.5 : 1 }}
            />
            <Box display="flex" flexWrap="wrap" mt={2} gap={1}>
              {variantImages.map(img => (
                <Box key={img.id} component="img" src={img.imageUrl} alt=""
                  sx={{
                    width: 60, height: 60, objectFit: "cover", cursor: "pointer",
                    border: selectedImage === img.imageUrl ? "2px solid" : "1px solid",
                    borderColor: selectedImage === img.imageUrl ? "primary.main" : "text.secondary",
                  }}
                  onMouseEnter={() => handleHoverImage(img.imageUrl)}
                  onMouseLeave={handleLeaveImage}
                  onClick={() => handleSelectImage(img.imageUrl)}
                />
              ))}
            </Box>
          </Box>

          {/* DETAILS */}
          <Box flex={1} mt={{ xs: 2, md: 0 }}>
            {/* PRICING & AVAILABILITY */}
            <Box mt={2}>
              {selectedVariant ? (
                selectedVariant.inStock ? (
                  <>
                    {/* Price in green */}
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {isDiscounted ? (
                        <>
                          <Box component="span" sx={{ textDecoration: "line-through", mr:1, color:"text.secondary" }}>
                            ₹{originalPrice.toLocaleString()}
                          </Box>
                          <Box component="span" fontWeight="bold" mr={1}>
                            ₹{discountedPrice.toLocaleString()}
                          </Box>
                          <Box component="span" color="success.main">({discountPercent}% off)</Box>
                        </>
                      ) : (
                        <>₹{originalPrice.toLocaleString()}</>
                      )}
                    </Typography>
                    {/* Availability under price */}
                    <Typography fontWeight="bold" color="success.main" mt={1}>Available</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" fontWeight="bold" color="error">Unavailable</Typography>
                    <Typography fontWeight="bold" color="error" mt={1}>Out of Stock</Typography>
                  </>
                )
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold" color="error">Unavailable</Typography>
                  <Typography fontWeight="bold" color="error" mt={1}>Stock unavailable for selected combination</Typography>
                </>
              )}
            </Box>

            {/* OPTIONS */}
            {colors.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" color="primary">Color</Typography>
                {colors.map(c => (
                  <Button key={c} variant={selectedColor === c ? "contained" : "outlined"} color="primary" size="small" onClick={() => setSelectedColor(c)} sx={{ mr:1, mt:1 }}>{c}</Button>
                ))}
              </Box>
            )}

            {purities.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" color="primary">Purity</Typography>
                {purities.map(p => (
                  <Button key={p} variant={selectedPurity === p ? "contained" : "outlined"} color="primary" size="small" onClick={() => setSelectedPurity(p)} sx={{ mr:1, mt:1 }}>{p}</Button>
                ))}
              </Box>
            )}

            {sizes.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" color="primary">Ring Size</Typography>
                {sizes.map(s => (
                  <Button key={s} variant={selectedSize === s.toString() ? "contained" : "outlined"} color="primary" size="small" onClick={() => setSelectedSize(s.toString())} sx={{ mr:1, mt:1 }}>{s}</Button>
                ))}
              </Box>
            )}

            <Box mt={4}>
              <Button variant="contained" color="primary" disabled={!selectedVariant || !selectedVariant.inStock} onClick={handleAddToCart} sx={{ mr:2 }}>Add to Cart</Button>
              <Button variant="contained" color="secondary" disabled={!selectedVariant || !selectedVariant.inStock}>Buy Now</Button>
            </Box>
          </Box>
        </Box>

        {/* FEATURES */}
        {product.features?.length > 0 && (
          <Card sx={{ mt:5, p:2 }}>
            <CardContent>
              <Typography variant="h5" color="primary">Jewelry Highlights</Typography>
              <ul>{product.features.map(f => <li key={f.id}>{f.feature || f.content}</li>)}</ul>
            </CardContent>
          </Card>
        )}

        {/* SPECIFICATIONS */}
        {product.specifications?.length > 0 && (
          <Card sx={{ mt:4, p:2 }}>
            <CardContent>
              <Typography variant="h5" color="primary">Jewelry Details</Typography>
              <ul>{product.specifications.map(s => <li key={s.id}><strong>{s.specKey}:</strong> {s.specValue}</li>)}</ul>
            </CardContent>
          </Card>
        )}

        {/* MANUFACTURER */}
        <Card sx={{ mt:4, p:2 }}>
          <CardContent>
            <Typography variant="h5" color="primary">From Manufacturer</Typography>
            <Typography>{manufacturer}</Typography>
          </CardContent>
        </Card>
      </Box>
    </SellerLayout>
  );
};

export default ProductDetailsPage;
