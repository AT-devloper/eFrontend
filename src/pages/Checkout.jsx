import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaCheck } from "react-icons/fa";
import { createOrder } from "../api/paymentApi";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
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

const Checkout = () => {
  const { cart, totalPrice, loading, fetchCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [processing, setProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ orderId: "", status: "" });

  // Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const getSafeAmount = (amount) => Math.floor(amount);

  const verifyPayment = async (orderId) => {
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:8080/auth/payment/status/check/${orderId}`);
      const data = await res.json();
      if (data.status === "PAID") {
        setPaymentDetails({ orderId, status: "SUCCESSFUL" });
        await fetchCart();
        setShowSuccessPopup(true);
      } else alert("Payment verification failed.");
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayNow = async () => {
    if (!user) return alert("Please log in.");
    setProcessing(true);
    try {
      const safeAmount = getSafeAmount(totalPrice);
      const data = await createOrder(safeAmount * 100, user.id);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "AT_LUXE",
        description: "Secure Checkout",
        order_id: data.orderId,
        prefill: { name: user.name || "", email: user.email || "" },
        theme: { color: COLORS.black },
        handler: function (response) {
          verifyPayment(response.razorpay_order_id);
        },
        modal: { ondismiss: () => setProcessing(false) },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Payment initialization failed.");
      setProcessing(false);
    }
  };

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
        
        {/* Header */}
        <Box mb={6} display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate("/cart")} sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 1 }}>
            <FaArrowLeft size={14} />
          </IconButton>
          <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
            SECURE CHECKOUT
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* --- Left: Order Items --- */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {cart.map((item) => (
                <Box
                  key={item.cartItemId}
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={3}
                  p={3}
                  bgcolor={COLORS.white}
                  borderRadius={2}
                  boxShadow="0 6px 18px rgba(0,0,0,0.05)"
                  sx={{ "&:hover": { boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } }}
                  alignItems="center"
                >
                  <Box sx={{ width: 140, height: 160, cursor: "pointer", flexShrink: 0 }}>
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                    />
                  </Box>

                  <Box flex={1} display="flex" justifyContent="space-between" flexDirection={isMobile ? "column" : "row"}>
                    <Box>
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                        {item.productName}
                      </Typography>
                      {item.variantName && (
                        <Typography variant="caption" color="text.secondary" mt={0.5} textTransform="uppercase" fontWeight={600}>
                          {item.variantName}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} mt={isMobile ? 2 : 0}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* --- Right: Payment Summary --- */}
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
                PAYMENT SUMMARY
              </Typography>

              <Stack spacing={2} mb={4}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Order Value</Typography>
                  <Typography fontWeight={600}>₹{totalPrice.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={600} color={COLORS.gold}>Free</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Tax (Included)</Typography>
                  <Typography fontWeight={600}>₹0.00</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={4}>
                <Typography variant="h6">TOTAL TO PAY</Typography>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                  ₹{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={processing}
                onClick={handlePayNow}
                sx={{
                  bgcolor: COLORS.black,
                  color: COLORS.white,
                  py: 2.5,
                  borderRadius: 1,
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: 2,
                  "&:hover": { bgcolor: COLORS.gold, color: COLORS.white },
                }}
              >
                {processing ? <CircularProgress size={24} color="inherit" /> : "PAY SECURELY"}
              </Button>

              <Box mt={4} textAlign="center">
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} color={COLORS.textLight} mb={1}>
                  <FaShieldAlt size={12} />
                  <Typography variant="caption" fontWeight={600} letterSpacing={1}>SSL ENCRYPTED PAYMENT</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Your personal data will be used to process your order and for other purposes described in our privacy policy.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- Success Popup --- */}
      <Dialog
        open={showSuccessPopup}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 4, border: `1px solid ${COLORS.black}`, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" } }}
      >
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ width: 80, height: 80, border: `2px solid ${COLORS.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
            <FaCheck size={30} color={COLORS.gold} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>
            ORDER CONFIRMED
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Thank you for shopping with AT-LUXE. Your order has been successfully placed.
          </Typography>
          <Box bgcolor={COLORS.gray} p={3} mb={4} border={`1px dashed ${COLORS.border}`} borderRadius={1}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">ORDER ID</Typography>
              <Typography variant="caption" fontWeight={700}>{paymentDetails.orderId}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={700} color="text.secondary">STATUS</Typography>
              <Typography variant="caption" fontWeight={700} color={COLORS.gold}>PAID</Typography>
            </Stack>
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/my-orders")}
            sx={{ bgcolor: COLORS.black, color: COLORS.white, borderRadius: 1, py: 1.5, fontWeight: 700, letterSpacing: 1, "&:hover": { bgcolor: COLORS.gold } }}
          >
            VIEW MY ORDERS
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Checkout;
