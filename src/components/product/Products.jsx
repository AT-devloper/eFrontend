import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import sellerApi from "../../api/sellerApi";
import { useCart } from "../../context/CartContext.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx";
import { Box, Typography, Grid, Container, Skeleton } from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

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
        setProducts(data.map((p, i) => ({ ...p, image: imagesData[i] })));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <SellerLayout>
      <Box sx={{ bgcolor: "#F2F0ED", minHeight: "100vh", py: 10 }}>
        <Container maxWidth="xl">
          {/* Subtle Hero Branding */}
          <Box sx={{ mb: 12, textAlign: "center" }}>
            <Typography variant="h1" sx={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: { xs: "3rem", md: "7rem" },
              fontWeight: 900,
              color: "rgba(0,0,0,0.05)",
              position: "absolute",
              left: 0, right: 0,
              zIndex: 0,
              textTransform: "uppercase"
            }}>
              The Curator
            </Typography>
            <Typography variant="h4" sx={{ 
              position: "relative", 
              zIndex: 1, 
              fontFamily: "'Playfair Display', serif", 
              pt: 4,
              color: "#222"
            }}>
              Essential Pieces
            </Typography>
          </Box>

          <Grid container spacing={10}>
            {loading ? (
              [1, 2, 3].map((i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Skeleton variant="circular" width={300} height={300} sx={{ mx: "auto" }} />
                </Grid>
              ))
            ) : (
              products.map((p, index) => (
                <ProductBubble 
                  key={p.productId} 
                  product={p} 
                  index={index} 
                  navigate={navigate} 
                  addToCart={addToCart}
                  inCart={cart.some(ci => ci.productId === p.productId)}
                />
              ))
            )}
          </Grid>
        </Container>
      </Box>
    </SellerLayout>
  );
};

const ProductBubble = ({ product, index, navigate, addToCart, inCart }) => {
  const [hover, setHover] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/products/${product.productId}`)}
        sx={{ position: "relative", textAlign: "center", cursor: "pointer" }}
      >
        {/* The "Bubble" Container */}
        <Box
          component={motion.div}
          animate={{ 
            borderRadius: hover ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%",
            scale: hover ? 1.05 : 1
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          sx={{
            width: "100%",
            aspectRatio: "1/1",
            overflow: "hidden",
            bgcolor: "#fff",
            boxShadow: hover ? "0 40px 100px rgba(0,0,0,0.1)" : "0 10px 40px rgba(0,0,0,0.02)",
            position: "relative",
            zIndex: 1
          }}
        >
          <motion.img
            src={product.image}
            animate={{ scale: hover ? 1.1 : 1.05 }}
            transition={{ duration: 1.5 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          
          {/* Quick Add Overlay Circle */}
          <AnimatePresence>
            {hover && (
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({ productId: product.productId, variantId: product.variants[0]?.id, quantity: 1 });
                }}
                sx={{
                  position: "absolute",
                  bottom: 20, right: 20,
                  width: 80, height: 80,
                  bgcolor: "#D8B67B",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 900, fontSize: "0.6rem", textAlign: "center",
                  boxShadow: "0 10px 20px rgba(216, 182, 123, 0.4)",
                  zIndex: 10
                }}
              >
                {inCart ? "OWNED" : "ADD +"}
              </Box>
            )}
          </AnimatePresence>
        </Box>

        {/* Floating Typography Details */}
        <Box sx={{ mt: -4, position: "relative", zIndex: 2 }}>
          <Typography
            sx={{
              display: "inline-block",
              bgcolor: "#000",
              color: "#fff",
              px: 2, py: 0.5,
              fontSize: "0.6rem",
              letterSpacing: 3,
              fontWeight: 800,
              textTransform: "uppercase"
            }}
          >
            {product.brand || "Selection"}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 900, 
              mt: 1,
              color: "#1a1a1a"
            }}
          >
            {product.name}
          </Typography>
          <Typography sx={{ fontWeight: 300, color: "#777", mt: 0.5 }}>
            ₹{product.price?.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default Products;