import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Cart = () => {
  const { cart, loading, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  return (
    <>
      <Navbar />

      <Container sx={{ py: 6, maxWidth: "lg" }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          My Cart
        </Typography>

        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                variant="outlined"
                sx={{ p: 2, display: "flex", gap: 2, borderRadius: 2 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#e0e0e0",
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: "60%",
                      height: 12,
                      bgcolor: "#e0e0e0",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{ width: "40%", height: 12, bgcolor: "#e0e0e0", borderRadius: 1 }}
                  />
                </Box>
              </Card>
            ))}
          </Stack>
        ) : cart.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <Stack spacing={2}>
              {cart.map((item) => (
                <Card
                  key={item.cartItemId}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                  }}
                >
                  {/* Product Image */}
                  <Box
                    component="img"
                    src={item.image || "/placeholder.png"}
                    alt={item.productName}
                    sx={{
                      width: { xs: "100%", sm: 100 },
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />

                  {/* Product Info */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.productName}
                    </Typography>
                    {item.variantId && (
                      <Typography variant="caption" color="text.secondary">
                        Variant: {item.variantId}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.price.toFixed(2)}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                      >
                        −
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <IconButton onClick={() => removeItem(item.cartItemId)} color="error">
                        <FaTrash />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Total Price for item */}
                  <Box
                    sx={{
                      minWidth: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography fontWeight={600}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>

            {/* Minimal Cart Summary at Bottom */}
            <Paper
              elevation={3}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#EFE8E3", // theme background
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Total: ₹{totalPrice.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => {
                  setCheckingOut(true);
                  navigate("/checkout");
                }}
                disabled={checkingOut}
              >
                {checkingOut ? <CircularProgress size={24} /> : "Checkout"}
              </Button>
            </Paper>
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Cart;
