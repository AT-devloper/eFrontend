import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaSearch, FaChevronDown } from "react-icons/fa";
import sellerApi from "../../api/sellerApi";
import { useCart } from "../../context/CartContext.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx";
import { 
  Box, Typography, Grid, Container, Skeleton, IconButton, 
  InputBase, Paper, Stack, Menu, MenuItem, Button, Rating 
} from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("Featured");

  const [productRatings, setProductRatings] = useState({}); 
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Engagement"];

  // Fetch products and images
  useEffect(() => {
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
        const mappedData = data.map((p, i) => ({ ...p, image: imagesData[i] }));
        setProducts(mappedData);
        setFilteredProducts(mappedData);

        // Fetch ratings for all products
        mappedData.forEach((p) => fetchProductRatings(p.productId));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch product ratings from Review API
  const fetchProductRatings = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8080/auth/reviews/product/${productId}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const totalRating = data.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = totalRating / data.length;
        setProductRatings((prev) => ({
          ...prev,
          [productId]: { avg: avgRating, count: data.length },
        }));
      } else {
        setProductRatings((prev) => ({ ...prev, [productId]: { avg: 0, count: 0 } }));
      }
    } catch (err) {
      console.error("Failed to fetch product ratings", err);
      setProductRatings((prev) => ({ ...prev, [productId]: { avg: 0, count: 0 } }));
    }
  };

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (sortBy === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result.sort((a, b) => b.price - a.price);

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products, sortBy]);

  return (
    <SellerLayout>
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        {/* Sticky Header with Search and Sort */}
        <Box sx={{ 
          position: "sticky", top: 0, zIndex: 1100, 
          bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(15px)",
          borderBottom: "1px solid #eee", py: 2 
        }}>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" spacing={4} sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: -0.5 }}>
                AT-LUXE
              </Typography>
              
              <Paper elevation={0} sx={{ display: "flex", alignItems: "center", px: 2, py: 0.8, bgcolor: "#f5f5f5", borderRadius: "4px", flex: 1, maxWidth: "400px" }}>
                <FaSearch size={12} color="#999" />
                <InputBase
                  placeholder="Search the archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ ml: 1, fontSize: "0.85rem", width: "100%" }}
                />
              </Paper>

              <Button 
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<FaChevronDown size={10} />}
                sx={{ color: "#000", textTransform: "none", fontSize: "0.8rem", fontWeight: 700 }}
              >
                {sortBy === "Featured" ? "SORT" : sortBy.toUpperCase()}
              </Button>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
              {categories.map((cat) => (
                <Typography
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    fontSize: "0.7rem", letterSpacing: 1.5, cursor: "pointer",
                    fontWeight: 800,
                    color: selectedCategory === cat ? "#D4AF37" : "#aaa",
                    borderBottom: selectedCategory === cat ? "2px solid #D4AF37" : "2px solid transparent",
                    pb: 1, transition: "0.3s", whiteSpace: "nowrap"
                  }}
                >
                  {cat.toUpperCase()}
                </Typography>
              ))}
            </Stack>
          </Container>
        </Box>

        {/* Product Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={5}>
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Skeleton variant="rectangular" height={350} sx={{ bgcolor: "#f9f9f9" }} />
                </Grid>
              ))
            ) : filteredProducts.map((p) => (
              <JewelryCard 
                key={p.productId} 
                product={p} 
                navigate={navigate} 
                addToCart={addToCart}
                inCart={cart.some(ci => ci.productId === p.productId)}
                rating={productRatings[p.productId]} 
              />
            ))}
          </Grid>
        </Container>

        {/* Sort Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setSortBy("Featured"); setAnchorEl(null); }}>Featured</MenuItem>
          <MenuItem onClick={() => { setSortBy("Price: Low to High"); setAnchorEl(null); }}>Price: Low to High</MenuItem>
          <MenuItem onClick={() => { setSortBy("Price: High to Low"); setAnchorEl(null); }}>Price: High to Low</MenuItem>
        </Menu>
      </Box>
    </SellerLayout>
  );
};

/* --- JewelryCard Component --- */
const JewelryCard = ({ product, navigate, addToCart, inCart, rating }) => {
  const [hover, setHover] = useState(false);

  return (
    <Grid item xs={6} md={3}>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/products/${product.productId}`)}
        sx={{ textAlign: "center", cursor: "pointer" }}
      >
        <Box sx={{ 
          position: "relative", 
          overflow: "hidden", 
          bgcolor: "#ffffff", 
          aspectRatio: "1/1.2", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          transition: "0.4s ease-in-out",
          transform: hover ? "translateY(-5px)" : "none"
        }}>
          <motion.img
            src={product.image}
            animate={{ scale: hover ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
                maxWidth: "90%", 
                maxHeight: "90%", 
                objectFit: "contain",
                mixBlendMode: "multiply" 
            }}
          />
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ productId: product.productId, variantId: product.variants?.[0]?.id, quantity: 1 });
            }}
            sx={{
              position: "absolute", bottom: 15,
              bgcolor: inCart ? "#D4AF37" : "#000",
              color: "#fff",
              opacity: hover ? 1 : 0,
              transform: hover ? "translateY(0)" : "translateY(10px)",
              borderRadius: "0px",
              width: "80%",
              fontSize: "0.6rem",
              fontWeight: 900,
              transition: "0.3s",
              "&:hover": { bgcolor: "#D4AF37" }
            }}
          >
            {inCart ? "IN CART" : "QUICK ADD"}
          </IconButton>
        </Box>

        <Box sx={{ mt: 2, px: 1 }}>
          <Typography variant="caption" sx={{ color: "#D4AF37", fontWeight: 800, letterSpacing: 1.5 }}>
            {product.category?.toUpperCase() || "AT-LUXE JEWELRY"}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", mt: 0.5, lineHeight: 1.2 }}>
            {product.name}
          </Typography>

          {/* Rating Section - Fixed height to prevent layout shift */}
<Box sx={{ 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  mt: 0.8, 
  mb: 0.2,
  height: "20px" // Prevents mixing/collapsing
}}>
  {rating && rating.count > 0 ? (
    <>
      <Rating 
        value={rating.avg} 
        precision={0.5} 
        readOnly 
        size="small" 
        sx={{ color: "#D4AF37", fontSize: "0.85rem" }} 
      />
      <Typography variant="caption" sx={{ color: "#888", ml: 0.5, fontSize: "0.7rem" }}>
        ({rating.count})
      </Typography>
    </>
  ) : (
    /* New Arrival Badge - Using a subtle background to separate it from product text */
    <Typography 
      variant="caption" 
      sx={{ 
        color: "#1a1a1a", // Darker text for visibility
        fontSize: "0.6rem", 
        letterSpacing: 1.5,
        fontWeight: 700,
        bgcolor: "#f0f0f0", // Subtle grey background
        px: 1,
        py: 0.2,
        borderRadius: "2px",
        textTransform: "uppercase"
      }}
    >
      New Arrival
    </Typography>
  )}
</Box>

          <Typography variant="body2" sx={{ color: "#000", mt: 0.2, fontWeight: 700 }}>
            ₹{Math.floor(product.price || 0).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default Products;