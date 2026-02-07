import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { createOrder, createSubscription } from "../api/paymentApi";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  Dialog,
  DialogContent,
  Zoom,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Checkout = () => {
  const { cart, totalPrice, removeItem, loading, fetchCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [processing, setProcessing] = useState(false);
  
  // ✅ NEW: Success Modal States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ orderId: "", status: "" });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const getSafeAmount = (amount) => Math.floor(amount);

  // ✅ VERIFY PAYMENT + SHOW POPUP
  const verifyPayment = async (orderId) => {
    setProcessing(true);
    try {
      const res = await fetch(
        `http://localhost:8080/auth/payment/status/check/${orderId}`
      );
      const data = await res.json();

      if (data.status === "PAID") {
        setPaymentDetails({ orderId: orderId, status: "SUCCESSFUL" });
        await fetchCart(); // Clear cart from backend/context
        setShowSuccessPopup(true); // 🔥 Trigger the UI Popup
      } else {
        setStatusMessage({
          type: "error",
          text: "Payment verification failed. Please contact support.",
        });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Verification failed." });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayNow = async () => {
    if (!user) {
      setStatusMessage({ type: "error", text: "Please log in." });
      return;
    }
    setProcessing(true);
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
        prefill: { name: user.name || "", email: user.email || "" },
        theme: { color: "#4A2E2E" },
        handler: function (response) {
          verifyPayment(response.razorpay_order_id);
        },
        modal: { ondismiss: () => setProcessing(false) },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setStatusMessage({ type: "error", text: "Payment initialization failed." });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      <Navbar />

      <Container sx={{ py: 6, maxWidth: "lg" }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'Playfair Display' }}>
            Checkout
          </Typography>
          <Button startIcon={<FaArrowLeft />} onClick={() => navigate("/cart")} sx={{ color: "text.secondary" }}>
            Back to Cart
          </Button>
        </Box>

        {statusMessage.text && <Alert severity={statusMessage.type} sx={{ mb: 4, borderRadius: 3 }}>{statusMessage.text}</Alert>}

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              {cart.map((item) => (
                <Paper key={item.cartItemId} sx={{ p: 2, display: "flex", gap: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <Box component="img" src={item.image || "/placeholder.png"} sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                    <Typography fontWeight={800} color="primary.main">₹{(item.price * item.quantity).toLocaleString()}</Typography>
                  </Box>
                  <IconButton onClick={() => removeItem(item.cartItemId)} color="error"><FaTrash size={16} /></IconButton>
                </Paper>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 4, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={800} mb={3}>Payment Summary</Typography>
              <Box sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Order Total</Typography>
                <Typography fontWeight={900} variant="h6">₹{totalPrice.toLocaleString()}</Typography>
              </Box>

              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  disabled={processing || cart.length === 0} 
                  onClick={handlePayNow}
                  sx={{ py: 2, borderRadius: 50, fontWeight: 800, bgcolor: "#4A2E2E", color: "#D8B67B", "&:hover": { bgcolor: "#3d2626" } }}
                >
                  {processing ? <CircularProgress size={24} color="inherit" /> : "Confirm & Pay"}
                </Button>
              </Stack>

              <Box sx={{ mt: 3, textAlign: "center", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <FaShieldAlt color="#10B981" />
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  100% Secure SSL Encrypted Payment
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- SUCCESS POPUP MODAL --- */}
      <Dialog 
        open={showSuccessPopup} 
        TransitionComponent={Zoom} 
        PaperProps={{ sx: { borderRadius: 5, p: 3, textAlign: "center", maxWidth: 450 } }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <FaCheckCircle size={70} color="#10B981" />
            
            <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'Playfair Display' }}>
              Order Confirmed!
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Thank you for shopping with AT_LUXE. Your payment was processed successfully.
            </Typography>

            <Paper variant="outlined" sx={{ width: '100%', p: 2, bgcolor: "#F8F9FA", borderRadius: 3, borderStyle: 'dashed' }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">PAYMENT ID</Typography>
                  <Typography variant="caption" fontWeight={800}>{paymentDetails.orderId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">STATUS</Typography>
                  <Typography variant="caption" fontWeight={900} color="#10B981">{paymentDetails.status}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={() => navigate("/my-orders")}
              sx={{ 
                mt: 2, py: 1.5, borderRadius: 50, fontWeight: 800, 
                bgcolor: "#4A2E2E", color: "#D8B67B",
                "&:hover": { bgcolor: "#3d2626" } 
              }}
            >
              View My Orders
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Checkout;