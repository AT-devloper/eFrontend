import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { createOrder, createSubscription } from "../api/paymentApi";
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
  Alert,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Checkout = () => {
  const { cart, totalPrice, removeItem, loading } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [processing, setProcessing] = useState(false);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const getSafeAmount = (amount) => Math.floor(amount);

  const handlePayNow = async () => {
    if (!user) {
      setStatusMessage({ type: "error", text: "Please log in to continue." });
      return;
    }
    setProcessing(true);
    setStatusMessage({ type: "info", text: "Connecting to secure gateway..." });

    try {
      const safeAmount = getSafeAmount(totalPrice);
      const data = await createOrder(safeAmount * 100, user.id);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "AT_LUXE",
        description: "Order Checkout",
        order_id: data.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#000000" },
        handler: function (response) {
          setStatusMessage({ type: "success", text: "Payment successful! Your order is placed." });
        },
        modal: { ondismiss: () => setProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to initialize payment." });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayMonthly = async () => {
    if (!user) {
      setStatusMessage({ type: "error", text: "Please log in to subscribe." });
      return;
    }
    setProcessing(true);
    setStatusMessage({ type: "info", text: "Initializing subscription..." });

    try {
      const data = await createSubscription(user.id);
      const options = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "AT_LUXE",
        description: "Monthly Luxury Plan",
        theme: { color: "#000000" },
        handler: function () {
          setStatusMessage({ type: "success", text: "Subscription successfully started!" });
        },
        modal: { ondismiss: () => setProcessing(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setStatusMessage({ type: "error", text: "Subscription setup failed." });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
            Checkout
          </Typography>
          <Button
            startIcon={<FaArrowLeft />}
            onClick={() => navigate("/cart")}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Back to Cart
          </Button>
        </Box>

        {statusMessage.text && (
          <Alert severity={statusMessage.type} sx={{ mb: 4, borderRadius: 3 }}>
            {statusMessage.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left: Items Summary */}
          <Grid item xs={12} md={7}>
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
                    sx={{
                      width: 100,
                      height: 100,
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
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography fontWeight={700} sx={{ mt: "auto" }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Grid>

          {/* Right: Payment Selection */}
          <Grid item xs={12} md={5}>
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
                Payment Summary
              </Typography>

              <Stack spacing={2} sx={{ my: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Order Total</Typography>
                  <Typography fontWeight={800} variant="h5">
                    ₹{totalPrice.toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
              </Stack>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={processing}
                  onClick={handlePayNow}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    bgcolor: "#000",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#222" },
                  }}
                >
                  {processing ? <CircularProgress size={24} color="inherit" /> : "Pay Full Amount"}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  disabled={processing}
                  onClick={handlePayMonthly}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    borderColor: "#000",
                    color: "#000",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { borderColor: "#333", bgcolor: "transparent" },
                  }}
                >
                  Pay Monthly (EMI)
                </Button>
              </Stack>

              <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <FaShieldAlt color="#10B981" />
                <Typography variant="caption" color="text.secondary">
                  100% Secure SSL Payment
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Checkout;