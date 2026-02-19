import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaMinus, FaPlus, FaArrowLeft, FaLock, FaTrashAlt } from "react-icons/fa";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Grid,
  useMediaQuery,
  Stack
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// --- Theme Config ---
const COLORS = {
  gold: "#C5A059",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#F9F9F9",
  textLight: "#888888",
  border: "#EAEAEA",
};

const Cart = () => {
  const { cart, loading, removeItem, updateQuantity, totalPrice, clearCart } = useCart(); // <--- Imported clearCart
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: COLORS.white }}>
        <CircularProgress sx={{ color: COLORS.gold }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: COLORS.gray, minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
        
        {/* --- Header Section --- */}
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
          
          {/* Left: Title & Back Button */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate("/products")} sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 1 }}>
              <FaArrowLeft size={14} />
            </IconButton>
            <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, letterSpacing: -1 }}>
              MY CART <span style={{ color: COLORS.textLight, fontSize: "1.5rem", fontWeight: 400, marginLeft: "8px" }}>{cart.length} ITEMS</span>
            </Typography>
          </Box>

          {/* Right: Clear All Button (Only show if cart has items) */}
          {cart.length > 0 && (
            <Button 
              onClick={clearCart} 
              startIcon={<FaTrashAlt size={14} />}
              sx={{ 
                color: "red", 
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: 1,
                "&:hover": { bgcolor: "#FFF0F0" } 
              }}
            >
              CLEAR CART
            </Button>
          )}
        </Box>

        {cart.length === 0 ? (
          <Box textAlign="center" py={15} borderRadius={2} border={`1px dashed ${COLORS.border}`} bgcolor={COLORS.white}>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", mb: 2 }}>Your Cart is empty.</Typography>
            <Typography color="text.secondary" mb={4}>Discover our new collection.</Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: COLORS.black,
                color: COLORS.white,
                borderRadius: 0,
                px: 6,
                py: 1.5,
                "&:hover": { bgcolor: COLORS.gold, color: COLORS.black },
              }}
            >
              SHOP NOW
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* --- Left Column: Cart Items --- */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        display="flex"
                        flexDirection={isMobile ? "column" : "row"}
                        gap={3}
                        p={3}
                        bgcolor={COLORS.white}
                        borderRadius={2}
                        boxShadow="0 6px 18px rgba(0,0,0,0.05)"
                        alignItems="center"
                        sx={{ "&:hover": { boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{ width: 140, height: 160, cursor: "pointer", flexShrink: 0 }}
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.productName}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                          />
                        </Box>

                        {/* Product Details */}
                        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                          <Box>
                            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                              {item.productName}
                            </Typography>
                            
                            {item.variantName && (
                              <Typography variant="caption" color="text.secondary" mt={0.5} textTransform="uppercase" fontWeight={600}>
                                {item.variantName}
                              </Typography>
                            )}

                            <Typography variant="body2" mt={1}>
                              ₹{item.price.toLocaleString()}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => removeItem(item.cartItemId)}
                            startIcon={<FaTimes size={12} />}
                            sx={{
                              color: COLORS.textLight,
                              justifyContent: "flex-start",
                              p: 0,
                              minWidth: 0,
                              mt: 1,
                              "&:hover": { color: "red", bgcolor: "transparent" },
                            }}
                          >
                            REMOVE
                          </Button>
                        </Box>

                        {/* Quantity */}
                        <Box display="flex" alignItems="center" mt={isMobile ? 2 : 0}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            sx={{ borderRadius: 1, width: 32, height: 32 }}
                          >
                            <FaMinus size={10} />
                          </IconButton>
                          <Typography sx={{ px: 2, fontSize: "0.95rem", fontWeight: 600 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            sx={{ borderRadius: 1, width: 32, height: 32 }}
                          >
                            <FaPlus size={10} />
                          </IconButton>
                        </Box>

                        {/* Total Price */}
                        <Box textAlign={isMobile ? "left" : "right"} flex={1} mt={isMobile ? 2 : 0}>
                          <Typography variant="h6" fontWeight={700}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            </Grid>

            {/* --- Right Column: Order Summary --- */}
            <Grid item xs={12} lg={4}>
              <Box
                sx={{
                  bgcolor: COLORS.white,
                  p: { xs: 3, md: 5 },
                  borderRadius: 2,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                  position: { lg: "sticky" },
                  top: 100,
                }}
              >
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", mb: 4, fontWeight: 700 }}>
                  ORDER SUMMARY
                </Typography>

                <Stack spacing={2} mb={4}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={600}>₹{totalPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography fontWeight={600} color={COLORS.gold}>Calculated at Checkout</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Tax</Typography>
                    <Typography fontWeight={600}>₹0.00</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 4 }} />

                <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={4}>
                  <Typography variant="h6">ESTIMATED TOTAL</Typography>
                  <Typography variant="h4" sx={{ color: COLORS.black, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                    ₹{totalPrice.toLocaleString()}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={checkingOut}
                  onClick={() => {
                    setCheckingOut(true);
                    setTimeout(() => navigate("/checkout"), 1000);
                  }}
                  sx={{
                    bgcolor: COLORS.black,
                    color: COLORS.white,
                    py: 2.5,
                    borderRadius: 1,
                    fontSize: "1rem",
                    fontWeight: 700,
                    letterSpacing: 2,
                    "&:hover": { bgcolor: COLORS.gold, color: COLORS.black },
                  }}
                >
                  {checkingOut ? <CircularProgress size={24} color="inherit" /> : "PROCEED TO CHECKOUT"}
                </Button>

                <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={1} color={COLORS.textLight}>
                  <FaLock size={12} />
                  <Typography variant="caption" fontWeight={600} letterSpacing={1}>
                    SECURE ENCRYPTED CHECKOUT
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Cart;