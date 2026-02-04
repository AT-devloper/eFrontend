// pages/Cart.js
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Cart = () => {
  const { cart, loading, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      <Navbar />

      <Container sx={{ py: { xs: 4, md: 8 }, maxWidth: "lg" }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
            Shopping Cart ({cart.length})
          </Typography>
          <Button
            startIcon={<FaArrowLeft />}
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Continue Shopping
          </Button>
        </Box>

        {cart.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your bag is empty.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, px: 4, borderRadius: 10 }}
              onClick={() => navigate("/")}
            >
              Fill it up
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Left: Items */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {cart.map((item) => (
                  <Paper
                    key={item.cartItemId}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image || "/placeholder.png"}
                      alt={item.productName}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                      sx={{
                        width: 120,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 3,
                        bgcolor: "#f0f0f0",
                      }}
                    />
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {item.productName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.cartItemId)}
                          sx={{ color: "#9CA3AF", "&:hover": { color: "#EF4444" } }}
                        >
                          <FaTrash size={14} />
                        </IconButton>
                      </Box>

                      {item.variantName ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Selected: {item.variantName}
                        </Typography>
                      ) : item.variantId ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Variant ID: {item.variantId}
                        </Typography>
                      ) : null}

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Unit Price: ₹{item.price.toLocaleString()}
                      </Typography>

                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E5E7EB",
                            borderRadius: 2,
                            bgcolor: "#fff",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={10} />
                          </IconButton>
                          <Typography sx={{ px: 2, fontWeight: 600 }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item, item.quantity + 1)}>
                            <FaPlus size={10} />
                          </IconButton>
                        </Box>
                        <Typography fontWeight={800} variant="h6">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Right: Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid #E5E7EB",
                  position: "sticky",
                  top: 100,
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ my: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={600}>₹{totalPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography color="success.main" fontWeight={600}>
                      Free
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={800}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      ₹{totalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={checkingOut}
                  onClick={() => {
                    setCheckingOut(true);
                    setTimeout(() => navigate("/checkout"), 1000);
                  }}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    bgcolor: "#000",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#222" },
                  }}
                >
                  {checkingOut ? <CircularProgress size={24} color="inherit" /> : "Proceed to Checkout"}
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                  display="block"
                  sx={{ mt: 2 }}
                >
                  Secure Checkout Guaranteed
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Cart;
