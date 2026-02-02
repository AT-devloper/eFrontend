import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { FaTrash } from "react-icons/fa";
import { createOrder, createSubscription } from "../api/paymentApi";
import {
  Container,
  Card,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Checkout = () => {
  const { cart, totalPrice, removeItem, updateQuantity } = useCart();
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => setItems(cart), [cart]);

  const getSafeAmount = (amount) => Math.floor(amount / 1000) * 1000;

  const handlePayNow = async () => {
    if (!user) {
      setStatusMessage("⚠️ You must be logged in to place an order.");
      return;
    }
    if (!items || items.length === 0) {
      setStatusMessage("⚠️ Your cart is empty.");
      return;
    }

    setProcessing(true);
    setStatusMessage("📝 Creating order...");
    const safeAmount = getSafeAmount(totalPrice);
    const razorpayAmount = safeAmount * 100;
    const { orderId, key, amount, error } = await createOrder(razorpayAmount, user.id);

    if (error) {
      setStatusMessage(`❌ ${error}`);
      setProcessing(false);
      return;
    }

    const options = {
      key,
      amount,
      currency: "INR",
      name: "AT_LUXE",
      description: `You will be charged ₹${safeAmount}`,
      order_id: orderId,
      prefill: {
        name: user.name || "John Doe",
        email: user.email || "john@example.com",
        contact: user.contact || "9999999999",
      },
      theme: { color: "#4A2E2E" },
      handler: async function () {
        setStatusMessage("💳 Payment processed. Verifying backend...");
      },
    };

    new window.Razorpay(options).open();
    setProcessing(false);
  };

  const handlePayMonthly = async () => {
    if (!user) {
      setStatusMessage("⚠️ You must be logged in to subscribe.");
      return;
    }
    if (!items || items.length === 0) {
      setStatusMessage("⚠️ Your cart is empty.");
      return;
    }

    setProcessing(true);
    setStatusMessage("📝 Creating subscription...");
    const safeAmount = getSafeAmount(totalPrice);
    const { subscriptionId, key, error } = await createSubscription(user.id);

    if (error) {
      setStatusMessage(`❌ ${error}`);
      setProcessing(false);
      return;
    }

    const options = {
      key,
      subscription_id: subscriptionId,
      name: "AT_LUXE",
      description: `You will be charged ₹${safeAmount} monthly`,
      theme: { color: "#4A2E2E" },
      handler: async function () {
        setStatusMessage("💳 Subscription payment processed. Verifying backend...");
      },
    };

    new window.Razorpay(options).open();
    setProcessing(false);
  };

  return (
    <>
      <Navbar />

      <Container sx={{ py: 6, maxWidth: "lg" }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Checkout
        </Typography>

        {statusMessage && (
          <Box
            sx={{
              mb: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: "#EFE8E3",
              color: "#3A2C2C",
            }}
          >
            {statusMessage}
          </Box>
        )}

        {items.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <Stack spacing={2}>
              {items.map((item) => (
                <Card
                  key={item.cartItemId}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box
                    component="img"
                    src={item.image || "/placeholder.png"}
                    alt={item.productName}
                    sx={{
                      width: { xs: "100%", sm: 120 },
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.productName}
                      </Typography>
                      {item.variantId && (
                        <Typography variant="caption" color="text.secondary">
                          Variant: {item.variantId}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        ₹{item.price.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: { xs: 1, sm: 0 } }}>
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

                  <Box sx={{ minWidth: 80, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <Typography fontWeight={600}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                </Card>
              ))}
            </Stack>

            {/* Total & Highlighted Minimal Buttons */}
            <Card sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  Total: ₹{totalPrice.toFixed(2)}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handlePayNow}
                    disabled={processing || !user}
                    sx={{
                      textTransform: "none",
                      minWidth: 100,
                      py: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {processing ? <CircularProgress size={16} /> : "Pay Now"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={handlePayMonthly}
                    disabled={processing || !user}
                    sx={{
                      textTransform: "none",
                      minWidth: 100,
                      py: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    Pay Monthly
                  </Button>
                </Stack>
              </Grid>
            </Card>
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Checkout;
