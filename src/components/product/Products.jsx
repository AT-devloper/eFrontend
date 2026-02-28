import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSortAmountDown, FaFilter, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
import sellerApi from "../../api/sellerApi";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx";
import {
  Box, Typography, Grid, Container, Skeleton, InputBase, Stack, Menu, MenuItem,
  Button, Rating, useMediaQuery, useTheme, Divider, IconButton, Drawer, Paper
} from "@mui/material";

// --- Theme Config ---
const THEME = {
  gold: "#C5A059",
  black: "#1a1a1a",
  white: "#ffffff",
  bg: "#FAFAFA",
  text: "#333333",
  danger: "#D32F2F"
};

// --- Filter Sidebar ---
const FilterSidebar = ({
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
  dynamicCategories, sortBy, setAnchorEl, setMobileOpen
}) => (
  <Box sx={{ height: "100%", p: { xs: 3, md: 0 } }}>
    {/* Search Box */}
    <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e0e0e0", pb: 1.5, mb: 4 }}>
      <FaSearch color="#999" size={14} />
      <InputBase
        placeholder="Search Collection..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ ml: 2, fontSize: "0.85rem", width: "100%", fontFamily: "inherit" }}
      />
    </Box>

    {/* Categories */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="overline" sx={{ color: "#999", fontWeight: 700, letterSpacing: 1.5, display: "block", mb: 2 }}>
        CATEGORIES
      </Typography>
      <Stack spacing={1.5}>
        {dynamicCategories.map((cat) => (
          <Box
            key={cat}
            onClick={() => { setSelectedCategory(cat); if (setMobileOpen) setMobileOpen(false); }}
            sx={{
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
              color: selectedCategory === cat ? THEME.black : "#666",
              transition: "0.2s",
              "&:hover": { color: THEME.black, transform: "translateX(5px)" }
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: selectedCategory === cat ? 700 : 400 }}>
              {cat}
            </Typography>
            {selectedCategory === cat && (
              <motion.div layoutId="active-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.gold }} />
            )}
          </Box>
        ))}
      </Stack>
    </Box>

    <Divider sx={{ mb: 3 }} />

    {/* Sort */}
    <Button
      onClick={(e) => setAnchorEl(e.currentTarget)}
      startIcon={<FaSortAmountDown size={12} />}
      sx={{ 
        color: THEME.black, fontSize: "0.75rem", fontWeight: 700, p: 0, 
        justifyContent: "flex-start", minWidth: 0, letterSpacing: 1 
      }}
    >
      SORT: {sortBy}
    </Button>
  </Box>
);

// --- Premium Product Card (New Design) ---
const PremiumProductCard = React.memo(({ product, navigate, addToCart, inCart, rating }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.productId);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      productId: product.productId,
      quantity: 1,
      ...(product.variants?.[0]?.id && { variantId: product.variants[0].id })
    });
  };

  const handleWishlist = (e) => {
  e.stopPropagation();
  toggleWishlist(product.productId);
};


  const formattedPrice = useMemo(() => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price || 0),
    [product.price]
  );

  return (
    <Grid item xs={6} sm={4} md={3} component={motion.div} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Paper
        elevation={0}
        onClick={() => navigate(`/products/${product.productId}`)}
        sx={{
          bgcolor: "transparent",
          borderRadius: 0,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          "&:hover .action-layer": { transform: "translateY(0)" }, // Trigger slide-up
          "&:hover .wishlist-btn": { opacity: 1, transform: "scale(1)" }
        }}
      >
        {/* Image Container */}
        <Box sx={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", bgcolor: "#fff", mb: 1.5 }}>
          <motion.img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Floating Wishlist Button */}
          <IconButton
            className="wishlist-btn"
            onClick={handleWishlist}
            sx={{
                position: "absolute", top: 10, right: 10,
                bgcolor: "rgba(255,255,255,0.9)",
                color: isWishlisted ? THEME.danger : "#888",
                width: 32, height: 32,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                opacity: { xs: 1, md: isWishlisted ? 1 : 0 }, // Visible on mobile or if active
                transform: { xs: "scale(1)", md: isWishlisted ? "scale(1)" : "scale(0.8)" },
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { bgcolor: "#fff", color: THEME.danger }
            }}
          >
            {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          </IconButton>

          {/* Slide-Up Add to Cart Button */}
          <Box
            className="action-layer"
            sx={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                transform: { xs: "translateY(0)", md: "translateY(100%)" }, // Always visible on mobile
                transition: "transform 0.3s ease",
                zIndex: 2
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                bgcolor: inCart ? THEME.gold : THEME.black,
                color: "#fff",
                borderRadius: 0,
                py: 1.5,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: 1,
                "&:hover": { bgcolor: inCart ? "#b8962e" : "#333" }
              }}
            >
              {inCart ? "ADDED" : "ADD TO Cart"}
            </Button>
          </Box>
        </Box>

        {/* Minimal Info */}
        <Box sx={{ px: 0.5 }}>
          <Typography variant="body2" noWrap sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1rem", color: THEME.black, mb: 0.5 }}>
            {product.name}
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#555" }}>
                {formattedPrice}
            </Typography>
            
            {rating && rating.count > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={rating.avg} precision={0.5} readOnly size="small" sx={{ color: THEME.gold, fontSize: "0.7rem" }} />
                    <Typography variant="caption" color="text.secondary">({rating.count})</Typography>
                </Stack>
            )}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
});

// --- Main Component ---
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [productRatings, setProductRatings] = useState({});

  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const data = await sellerApi.getProductListing();
        const imagesData = await Promise.all(
          data.map((p) =>
            sellerApi.getProductImages(p.productId)
              .then((images) => images[0]?.imageUrl || "/placeholder.png")
              .catch(() => "/placeholder.png")
          )
        );

        if (isMounted) {
          const mappedData = data.map((p, i) => ({ ...p, image: imagesData[i] }));
          setProducts(mappedData);
          mappedData.forEach((p) => fetchProductRatings(p.productId));
        }
      } catch (error) { console.error(error); } 
      finally { if (isMounted) setLoading(false); }
    };

    const fetchProductRatings = async (productId) => {
      try {
        const res = await fetch(`http://localhost:8080/auth/reviews/product/${productId}`);
        const data = await res.json();
        setProductRatings((prev) => ({
          ...prev,
          [productId]: data.length > 0 ? { avg: data.reduce((a, r) => a + r.rating, 0) / data.length, count: data.length } : { avg: 0, count: 0 }
        }));
      } catch { setProductRatings((prev) => ({ ...prev, [productId]: { avg: 0, count: 0 } })); }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const dynamicCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <SellerLayout>
      <Box sx={{ bgcolor: THEME.bg, minHeight: "100vh" }}>
        
        {/* Mobile Header */}
        <Box sx={{ 
            display: { xs: "flex", md: "none" }, justifyContent: "space-between", alignItems: "center", 
            px: 2, py: 2, position: "sticky", top: 0, zIndex: 1100, 
            bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eee" 
        }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>AT-LUXE</Typography>
          <Button variant="text" startIcon={<FaFilter size={12} />} onClick={() => setMobileOpen(true)} sx={{ color: THEME.black, fontWeight: 700, fontSize: "0.8rem" }}>
            FILTER
          </Button>
        </Box>

        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 6 } }}>
          <Grid container spacing={{ xs: 2, md: 6 }}>
            
            {/* Sidebar (Desktop) */}
            <Grid item md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ position: "sticky", top: 100 }}>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: THEME.black, mb: 4, lineHeight: 0.9 }}>
                  THE<br />COLLECTIONS
                </Typography>
                <FilterSidebar
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  dynamicCategories={dynamicCategories} sortBy={sortBy} setAnchorEl={setAnchorEl}
                />
              </Box>
            </Grid>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: {  borderTopLeftRadius: 30, 
            borderBottomLeftRadius: 30,width: "45%", maxWidth: 350, p: 2 } }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <IconButton onClick={() => setMobileOpen(false)}><FaTimes /></IconButton>
              </Box>
              <FilterSidebar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                dynamicCategories={dynamicCategories} sortBy={sortBy} setAnchorEl={setAnchorEl} setMobileOpen={setMobileOpen}
              />
            </Drawer>

            {/* Product Grid */}
            <Grid item xs={12} md={9} lg={9.5}>
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #eaeaea", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#888", letterSpacing: 1 }}>
                  {filteredProducts.length} PIECES
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Grid item xs={6} sm={4} md={3} key={i}>
                        <Skeleton variant="rectangular" sx={{ aspectRatio: "3/4", mb: 1 }} />
                        <Skeleton width="80%" />
                        <Skeleton width="40%" />
                      </Grid>
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <PremiumProductCard
                        key={p.productId}
                        product={p}
                        navigate={navigate}
                        addToCart={addToCart}
                        inCart={cart.some((ci) => ci.productId === p.productId)}
                        rating={productRatings[p.productId]}
                      />
                    ))
                  ) : (
                    <Box sx={{ width: "100%", py: 15, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: "#999" }}>No pieces found in this collection.</Typography>
                      <Button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} sx={{ mt: 2, color: THEME.gold, fontWeight: 700 }}>Reset Filters</Button>
                    </Box>
                  )}
                </AnimatePresence>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Sort Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: 1, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" } }}>
          {["Featured", "Price: Low to High", "Price: High to Low"].map((opt) => (
            <MenuItem key={opt} onClick={() => { setSortBy(opt); setAnchorEl(null); }} sx={{ fontSize: "0.85rem", px: 3, py: 1.5 }}>{opt}</MenuItem>
          ))}
        </Menu>
      </Box>
    </SellerLayout>
  );
};

export default Products;