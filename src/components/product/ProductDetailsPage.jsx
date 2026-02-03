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
  Divider,
  Grid,
  Stack,
  Paper,
  Container,
  Chip,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";
import { 
  FavoriteBorder, 
  LocalShippingOutlined, 
  VerifiedUserOutlined, 
  CachedOutlined,
  ShareOutlined
} from "@mui/icons-material";

/* ---------- LOGIC REMAINS EXACTLY SAME ---------- */
const parseSku = (sku) => {
  if (!sku) return {};
  const [colorCode, purity, size] = sku.split("-");
  const colorMap = { YEL: "Yellow Gold", WHI: "White Gold", ROS: "Rose Gold" };
  return {
    color: colorMap[colorCode] || colorCode,
    purity,
    size: size ? size.toString() : null,
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sellerApi.getProductPage(productId);
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
        setProduct({});
      } finally {
        setLoading(false);
      }
    };
    if (productId) load();
  }, [productId]);

  const colors = useMemo(() => [...new Set(variants.map(v => v.color).filter(Boolean))], [variants]);
  const purities = useMemo(() => [...new Set(variants.map(v => v.purity).filter(Boolean))], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map(v => v.size).filter(Boolean))].sort((a,b) => a-b), [variants]);

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

  useEffect(() => {
    if (!variants.length) return;
    const match = variants.find(v =>
        (!colors.length || v.color === selectedColor) &&
        (!purities.length || v.purity === selectedPurity) &&
        (!sizes.length || v.size === selectedSize)
    );
    setSelectedVariant(match || null);
    if (match) updateImagesForVariant(match.id);
  }, [selectedColor, selectedPurity, selectedSize, variants]);

  const updateImagesForVariant = (variantId) => {
    const filtered = (product?.images || []).filter(img => !img.variantId || img.variantId === variantId);
    setVariantImages(filtered);
    const firstImg = filtered[0]?.imageUrl || "/placeholder.png";
    setMainImage(firstImg);
    setSelectedImage(firstImg);
  };

  const handleHoverImage = (imageUrl) => {
    setFade(true);
    setTimeout(() => { setMainImage(imageUrl); setFade(false); }, 150);
  };
  const handleLeaveImage = () => handleHoverImage(selectedImage);
  const handleSelectImage = (imageUrl) => { setSelectedImage(imageUrl); setMainImage(imageUrl); };

  const { discountedPrice, originalPrice, discountPercent } = useMemo(() => {
    if (!selectedVariant) return { discountedPrice: 0, originalPrice: 0, discountPercent: 0 };
    const mrp = Number(selectedVariant.price?.mrp ?? selectedVariant.price ?? 0);
    const discountValue = Number(selectedVariant.discount?.discountValue || 0);
    const discountType = selectedVariant.discount?.discountType || "PERCENT";
    let sp = mrp;
    if (discountType === "PERCENT") sp -= (sp * discountValue) / 100;
    else if (discountType === "FIXED") sp -= discountValue;
    const percent = discountType === "PERCENT" ? discountValue : mrp ? Math.round(((mrp - sp) / mrp) * 100) : 0;
    return { discountedPrice: sp < 0 ? 0 : sp, originalPrice: mrp, discountPercent: percent };
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (!selectedVariant?.inStock) return alert("Unavailable");
    addToCart({ productId: Number(productId), variantId: selectedVariant.id, quantity: 1, price: originalPrice });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <SellerLayout>
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 10 }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ py: 2, fontSize: '0.875rem' }}>
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Link underline="hover" color="inherit" href="/shop">Jewelry</Link>
            <Typography color="text.primary" fontSize="inherit">{product.name}</Typography>
          </Breadcrumbs>

          <Grid container spacing={6}>
            {/* LEFT: IMAGE GALLERY */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Stack spacing={1.5}>
                    {variantImages.map((img) => (
                      <Box
                        key={img.id}
                        component="img"
                        src={img.imageUrl}
                        onClick={() => handleSelectImage(img.imageUrl)}
                        onMouseEnter={() => handleHoverImage(img.imageUrl)}
                        onMouseLeave={handleLeaveImage}
                        sx={{
                          width: '100%',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          border: selectedImage === img.imageUrl ? "2px solid #000" : "1px solid #eee",
                          opacity: selectedImage === img.imageUrl ? 1 : 0.7,
                          '&:hover': { opacity: 1 }
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ position: 'relative', bgcolor: '#f9f9f9', borderRadius: '8px', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={mainImage}
                      sx={{
                        width: "100%",
                        aspectRatio: '1/1',
                        objectFit: "contain",
                        transition: "opacity 0.2s",
                        opacity: fade ? 0 : 1
                      }}
                    />
                    <IconButton sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'white', '&:hover': {bgcolor: '#f5f5f5'} }}>
                        <FavoriteBorder fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT: CONTENT */}
            <Grid item xs={12} md={5}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1 }}>
                        {product.brandName?.toUpperCase()}
                    </Typography>
                    <IconButton size="small"><ShareOutlined fontSize="small"/></IconButton>
                </Stack>
                
                <Typography variant="h3" sx={{ fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.2 }}>
                  {product.name}
                </Typography>
                
                

                <Box sx={{ py: 2, px: 2, bgcolor: '#fcf8f1', borderRadius: '4px' }}>
                  <Stack direction="row" alignItems="baseline" spacing={1.5}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ₹{discountedPrice.toLocaleString()}
                    </Typography>
                    {discountPercent > 0 && (
                      <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        ₹{originalPrice.toLocaleString()}
                      </Typography>
                    )}
                    {discountPercent > 0 && (
                      <Typography variant="body1" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                        ({discountPercent}% OFF)
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Inclusive of all taxes. Free Shipping on this item.
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* SELECTORS */}
                <Stack spacing={3}>
                  {/* Metal Color Selection */}
                  {colors.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>METAL COLOR: <span style={{fontWeight: 400}}>{selectedColor}</span></Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        {colors.map(c => (
                          <Box
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            sx={{
                              p: '2px',
                              border: selectedColor === c ? '2px solid #000' : '1px solid #ddd',
                              borderRadius: '50%',
                              cursor: 'pointer'
                            }}
                          >
                             <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: c.includes('Yellow') ? '#E6C173' : c.includes('White') ? '#E5E5E5' : '#E6A794' }} />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Purity Selection */}
                  {purities.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>PURITY</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {purities.map(p => (
                          <Chip
                            key={p}
                            label={p}
                            onClick={() => setSelectedPurity(p)}
                            variant={selectedPurity === p ? "filled" : "outlined"}
                            sx={{ borderRadius: '4px', fontWeight: 500, bgcolor: selectedPurity === p ? '#000' : 'transparent', color: selectedPurity === p ? '#fff' : '#000' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Size Selection */}
                  {sizes.length > 0 && (
                    <Box>
                       <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>SIZE</Typography>
                          <Link href="#" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Size Guide</Link>
                       </Stack>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {sizes.map(s => (
                          <Box
                            key={s}
                            onClick={() => setSelectedSize(s.toString())}
                            sx={{
                              minWidth: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: selectedSize === s.toString() ? '2px solid #000' : '1px solid #ddd',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: selectedSize === s.toString() ? 700 : 400
                            }}
                          >
                            {s}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>

                <Box sx={{ pt: 3 }}>
                   <Typography variant="subtitle2" sx={{ mb: 2, color: selectedVariant?.inStock ? 'success.main' : 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor' }} />
                      {selectedVariant?.inStock ? "Ready to ship" : "Currently Out of Stock"}
                    </Typography>

                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={!selectedVariant?.inStock}
                      onClick={handleAddToCart}
                      sx={{ py: 1.8, bgcolor: '#000', '&:hover': {bgcolor: '#333'}, borderRadius: '0', fontWeight: 600 }}
                    >
                      ADD TO CART
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={!selectedVariant?.inStock}
                      sx={{ py: 1.8, color: '#000', borderColor: '#000', borderRadius: '0', fontWeight: 600, '&:hover': {borderColor: '#333', bgcolor: 'transparent'} }}
                    >
                      BUY NOW
                    </Button>
                  </Stack>
                </Box>

                {/* Trust Badges */}
                <Grid container spacing={2} sx={{ pt: 4 }}>
                   {[
                       {icon: <LocalShippingOutlined fontSize="small"/>, text: "Free Delivery"},
                       {icon: <VerifiedUserOutlined fontSize="small"/>, text: "Certified Jewelry"},
                       {icon: <CachedOutlined fontSize="small"/>, text: "Easy Returns"},
                   ].map((item, i) => (
                       <Grid item xs={4} key={i} textAlign="center">
                           <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                           <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>{item.text}</Typography>
                       </Grid>
                   ))}
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          {/* Details Section */}
          <Box sx={{ mt: 10 }}>
             <Divider />
             <Grid container spacing={8} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Product Story</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        {product.description}
                    </Typography>
                    <Box component="ul" sx={{ mt: 3, pl: 2 }}>
                        {(product.features || []).map(f => (
                        <Typography component="li" key={f.id} sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {f.feature || f.content}
                        </Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Specifications</Typography>
                    <Stack spacing={1.5}>
                        {(product.specifications || []).map((s) => (
                            <Stack key={s.id} direction="row" justifyContent="space-between" sx={{ pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                                <Typography variant="body2" color="text.secondary">{s.specKey}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.specValue}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
             </Grid>
          </Box>
        </Container>
      </Box>
    </SellerLayout>
  );
};

export default ProductDetailsPage;