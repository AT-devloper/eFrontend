import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import sellerApi from "../../api/sellerApi.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx";
import { useCart } from "../../context/CartContext.jsx";
import {
  Button, Typography, Box, CircularProgress, Divider, Grid, Stack,
  Container, Chip, Breadcrumbs, Link, IconButton, Rating, LinearProgress,
  Paper, Tooltip
} from "@mui/material";
import {
  FavoriteBorder, LocalShippingOutlined, VerifiedUserOutlined,
  CachedOutlined, ShareOutlined, InfoOutlined, ShoppingBagOutlined,
  FlashOn
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

  /* --- REVIEWS STATE --- */
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ avg: 0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });

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

        const reviewRes = await fetch(`http://localhost:8080/auth/reviews/product/${productId}`);
        const reviewData = await reviewRes.json();
        setReviews(reviewData);
        if (reviewData.length > 0) {
          const total = reviewData.length;
          const avg = reviewData.reduce((acc, r) => acc + r.rating, 0) / total;
          const counts = reviewData.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
          }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          setRatingStats({ avg, total, counts });
        }
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
  const sizes = useMemo(() => [...new Set(variants.map(v => v.size).filter(Boolean))].sort((a, b) => a - b), [variants]);

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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <SellerLayout>
      <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 10 }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ py: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Link underline="hover" color="inherit" href="/shop">Jewelry</Link>
            <Typography fontSize="inherit" color="text.primary">{product.name}</Typography>
          </Breadcrumbs>

          <Grid container spacing={4}>
            {/* LEFT: IMAGE GALLERY (Amazon Style) */}
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      {variantImages.map((img) => (
                        <Paper
                          key={img.id}
                          elevation={0}
                          component="img"
                          src={img.imageUrl}
                          onClick={() => handleSelectImage(img.imageUrl)}
                          onMouseEnter={() => handleHoverImage(img.imageUrl)}
                          onMouseLeave={handleLeaveImage}
                          sx={{
                            width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px',
                            border: selectedImage === img.imageUrl ? "2px solid #D4AF37" : "1px solid #E0E0E0",
                            transition: '0.2s', '&:hover': { borderColor: '#D4AF37' }
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={10}>
                    <Paper elevation={0} sx={{ position: 'relative', bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E0E0E0' }}>
                      <Box component="img" src={mainImage} sx={{ width: "100%", aspectRatio: '1/1', objectFit: "contain", transition: "opacity 0.2s", opacity: fade ? 0.5 : 1 }} />
                      <IconButton sx={{ position: 'absolute', top: 15, right: 15, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: '#fff' } }}>
                        <FavoriteBorder fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* RIGHT: PURCHASE PANEL */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '8px', border: '1px solid #E0E0E0', bgcolor: '#fff' }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: 2 }}>
                        {product.brandName}
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 600, mt: 0.5, lineHeight: 1.3 }}>
                        {product.name}
                      </Typography>
                    </Box>
                    <IconButton size="small"><ShareOutlined fontSize="small" /></IconButton>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ my: 1 }}>
                    <Rating value={ratingStats.avg} precision={0.5} readOnly size="small" sx={{ color: '#D4AF37' }} />
                    <Link href="#reviews" underline="hover" sx={{ fontSize: '0.85rem', color: '#007185' }}>
                      {ratingStats.total} reviews
                    </Link>
                  </Stack>

                  <Divider />

                  <Box sx={{ py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#B12704' }}>
                        ₹{discountedPrice.toLocaleString()}
                      </Typography>
                      {discountPercent > 0 && (
                        <Typography variant="body2" sx={{ color: '#565959' }}>
                          M.R.P: <span style={{ textDecoration: 'line-through' }}>₹{originalPrice.toLocaleString()}</span>
                        </Typography>
                      )}
                    </Stack>
                    {discountPercent > 0 && (
                      <Typography variant="body2" sx={{ color: '#CC0C39', fontWeight: 700 }}>
                        -{discountPercent}% OFF
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: '#565959', display: 'block', mt: 0.5 }}>
                      Inclusive of all taxes
                    </Typography>
                  </Box>

                  <Divider />

                  {/* SELECTORS */}
                  <Stack spacing={2.5} sx={{ py: 2 }}>
                    {colors.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Metal: <b>{selectedColor}</b></Typography>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          {colors.map(c => (
                            <Tooltip title={c} key={c}>
                              <Box
                                onClick={() => setSelectedColor(c)}
                                sx={{
                                  p: '2px', border: selectedColor === c ? '2px solid #D4AF37' : '1px solid #ddd',
                                  borderRadius: '50%', cursor: 'pointer', transition: '0.2s'
                                }}
                              >
                                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: c.includes('Yellow') ? '#E6C173' : c.includes('White') ? '#E5E5E5' : '#E6A794' }} />
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {purities.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Purity</Typography>
                        <Stack direction="row" spacing={1}>
                          {purities.map(p => (
                            <Chip
                              key={p} label={p} onClick={() => setSelectedPurity(p)}
                              sx={{
                                borderRadius: '4px', px: 1, height: '32px',
                                border: selectedPurity === p ? '1px solid #D4AF37' : '1px solid #E0E0E0',
                                bgcolor: selectedPurity === p ? '#FFF9E1' : '#fff',
                                color: selectedPurity === p ? '#D4AF37' : '#000',
                                '&:hover': { bgcolor: '#F5F5F5' }
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {sizes.length > 0 && (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>Size</Typography>
                          <Link href="#" sx={{ fontSize: '0.75rem', color: '#007185' }}>Size Guide</Link>
                        </Stack>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {sizes.map(s => (
                            <Box
                              key={s} onClick={() => setSelectedSize(s.toString())}
                              sx={{
                                minWidth: 45, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: selectedSize === s.toString() ? '2px solid #D4AF37' : '1px solid #D5D9D9',
                                borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', bgcolor: selectedSize === s.toString() ? '#FFF9E1' : '#fff'
                              }}
                            >
                              {s}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>

                  {/* ACTION BOX */}
                  <Box sx={{ pt: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: selectedVariant?.inStock ? '#007600' : '#B12704', mb: 2 }}>
                      {selectedVariant?.inStock ? "In Stock" : "Currently Unavailable"}
                    </Typography>

                    <Stack spacing={1.5}>
                      <Button
                        fullWidth variant="contained" disableElevation
                        disabled={!selectedVariant?.inStock} onClick={handleAddToCart}
                        startIcon={<ShoppingBagOutlined />}
                        sx={{ py: 1.2, bgcolor: '#FFD814', color: '#0F1111', '&:hover': { bgcolor: '#F7CA00' }, borderRadius: '50px', fontWeight: 500, textTransform: 'none' }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        fullWidth variant="contained" disableElevation
                        disabled={!selectedVariant?.inStock}
                        startIcon={<FlashOn />}
                        sx={{ py: 1.2, bgcolor: '#FFA41C', color: '#0F1111', '&:hover': { bgcolor: '#F3A847' }, borderRadius: '50px', fontWeight: 500, textTransform: 'none' }}
                      >
                        Buy Now
                      </Button>
                    </Stack>
                  </Box>

                  {/* TRUST STRIP */}
                  <Grid container sx={{ mt: 3, pt: 2, borderTop: '1px solid #EEE' }}>
                    {[
                      { icon: <LocalShippingOutlined fontSize="small" />, text: "Free Delivery" },
                      { icon: <VerifiedUserOutlined fontSize="small" />, text: "Certified" },
                      { icon: <CachedOutlined fontSize="small" />, text: "7 Days Return" }
                    ].map((item, i) => (
                      <Grid item xs={4} key={i} textAlign="center">
                        <Box sx={{ color: '#565959' }}>{item.icon}</Box>
                        <Typography variant="caption" sx={{ color: '#007185', fontWeight: 500 }}>{item.text}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* REVIEWS SECTION - AMZ STYLE */}
          <Box id="reviews" sx={{ mt: 8, pt: 6, borderTop: '1px solid #E0E0E0' }}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Customer Reviews</Typography>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Rating value={ratingStats.avg} precision={0.1} readOnly sx={{ color: '#D4AF37' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{ratingStats.avg.toFixed(1)} out of 5</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#565959', mb: 3 }}>{ratingStats.total} global ratings</Typography>

                <Stack spacing={1}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Stack key={star} direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2" sx={{ minWidth: 40, color: '#007185' }}>{star} star</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={ratingStats.total > 0 ? (ratingStats.counts[star] / ratingStats.total) * 100 : 0}
                        sx={{ flexGrow: 1, height: 20, borderRadius: 1, bgcolor: '#F0F2F2', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 35, textAlign: 'right', color: '#007185' }}>
                        {ratingStats.total > 0 ? Math.round((ratingStats.counts[star] / ratingStats.total) * 100) : 0}%
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Top reviews</Typography>
                <Stack spacing={5}>
                  {reviews.length > 0 ? reviews.map((rev) => (
                    <Box key={rev.id}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                        <Box sx={{ width: 32, height: 32, bgcolor: '#DDD', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{rev.userName?.charAt(0) || 'C'}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{rev.userName || "Customer"}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Rating value={rev.rating} size="small" readOnly sx={{ color: '#D4AF37' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Verified Purchase</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Typography>
                      <Typography variant="body1" sx={{ mt: 1.5, color: '#0F1111' }}>{rev.comment}</Typography>
                    </Box>
                  )) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No reviews yet.</Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* PRODUCT DETAILS GRID */}
          <Box sx={{ mt: 10, bgcolor: '#fff', p: 4, borderRadius: '8px', border: '1px solid #E0E0E0' }}>
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Product Description</Typography>
                <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.8 }}>{product.description}</Typography>
                <Box component="ul" sx={{ mt: 2, pl: 2 }}>
                  {(product.features || []).map(f => (
                    <Typography component="li" key={f.id} variant="body2" sx={{ mb: 1, color: '#565959' }}>{f.feature || f.content}</Typography>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Specifications</Typography>
                <Paper elevation={0} sx={{ border: '1px solid #EEE' }}>
                  {(product.specifications || []).map((s, idx) => (
                    <Stack
                      key={s.id} direction="row"
                      sx={{ p: 1.5, bgcolor: idx % 2 === 0 ? '#F9F9F9' : '#FFF', borderBottom: idx !== product.specifications.length - 1 ? '1px solid #EEE' : 'none' }}
                    >
                      <Typography variant="body2" sx={{ width: '40%', fontWeight: 700, color: '#565959' }}>{s.specKey}</Typography>
                      <Typography variant="body2" sx={{ width: '60%' }}>{s.specValue}</Typography>
                    </Stack>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </SellerLayout>
  );
};

export default ProductDetailsPage;