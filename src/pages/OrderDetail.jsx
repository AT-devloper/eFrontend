import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  TextField,
  Rating,
  Stack,
  Paper,
  Chip,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  ArrowBack,
  RateReview,
  CheckCircle,
  ContentCopy,
  StarBorder,
  ReceiptLong,
  SupportAgent,
  ExpandMore,
  ExpandLess,
  CancelOutlined,
  KeyboardReturn,
  Edit
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORTS ---
import sellerApi from "../api/sellerApi";
import orderApi from "../api/orderApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import reviewApi from "../api/reviewApi";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

// --- 1. LUXURY TIMELINE COMPONENT ---
const LuxuryTimeline = ({ currentStep, steps }) => {
  const theme = useTheme();
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <Box sx={{ width: "100%", position: "relative", my: 4 }}>
      <Box sx={{ 
        position: "absolute", top: "15px", left: 0, right: 0, height: "1px", 
        bgcolor: "rgba(0,0,0,0.1)", zIndex: 0 
      }} />
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ 
          position: "absolute", top: "15px", left: 0, height: "2px", 
          backgroundColor: theme.palette.secondary.main, 
          zIndex: 1,
          boxShadow: `0 0 10px ${theme.palette.secondary.main}`
        }} 
      />

      <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 2 }}>
        {steps.map((label, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <Box key={label} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: isActive ? 1 : 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box sx={{ position: "relative" }}>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute", inset: -6, borderRadius: "50%",
                        border: `1px solid ${theme.palette.secondary.main}`
                      }}
                    />
                  )}
                  
                  <Box sx={{ 
                    width: "32px", height: "32px", borderRadius: "50%", 
                    bgcolor: isActive ? theme.palette.primary.main : theme.palette.background.paper,
                    border: `2px solid ${isActive ? theme.palette.secondary.main : "#ccc"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
                    transition: "all 0.3s ease"
                  }}>
                    {isActive && <CheckCircle sx={{ fontSize: 18, color: theme.palette.secondary.main }} />}
                  </Box>
                </Box>
              </motion.div>
              
              <Typography variant="caption" sx={{ 
                mt: 1.5, 
                fontWeight: isCurrent ? 800 : 500, 
                color: isActive ? theme.palette.primary.main : "#aaa",
                letterSpacing: 0.5,
                fontSize: "0.65rem",
                textTransform: "uppercase",
                textAlign: "center"
              }}>
                {label.replace("_", " ")}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

// --- 2. MAIN PAGE COMPONENT ---
const OrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [expandedReview, setExpandedReview] = useState({});
  const [isExistingReview, setIsExistingReview] = useState({}); // New: Tracks if already reviewed

  // ===== ORDER FLOW DEFINITIONS =====
const deliverySteps = [
  "ORDERED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

const returnSteps = [
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_PICKED",
  "RETURN_COMPLETED"
];

const cancelSteps = [
  "ORDERED",
  "CONFIRMED",
  "PACKED",
  "CANCELLED"
];



  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getOrderByNumber(orderNumber);

        const itemsWithDetails = await Promise.all(
          data.items.map(async (item) => {
            let imageUrl = "/placeholder.png";
            let fullDescription = "";
            
            try {
              const images = await sellerApi.getProductImages(item.productId);
              imageUrl = images[0]?.imageUrl || "/placeholder.png";
            } catch (e) { console.warn(e); }

            try {
               const productData = await sellerApi.getProductPage(item.productId);
               fullDescription = productData.description || productData.product?.description || "Description unavailable.";
            } catch (e) { console.warn(e); }

            return { ...item, image: imageUrl, description: fullDescription };
          })
        );

        setOrderData({ ...data, items: itemsWithDetails });
        itemsWithDetails.forEach((item) => fetchProductReviews(item.productId));
        
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetail();
    }
  }, [orderNumber]);

  const fetchProductReviews = async (productId) => {
    try {
      const res = await reviewApi.getReviewsByProduct(productId);
      const userId = Number(localStorage.getItem("userId"));
      const existingReview = res.find(r => r.userId === userId);

      if (existingReview) {
        setIsExistingReview(prev => ({ ...prev, [productId]: true }));
        setRatings(prev => ({ ...prev, [productId]: existingReview.rating }));
        setReviews(prev => ({ ...prev, [productId]: existingReview.comment }));
      }
    } catch (err) {
      console.error("Failed to fetch product reviews");
    }
  };

  const handleCopyId = () => {
    if (orderData?.order?.orderNumber) {
      navigator.clipboard.writeText(orderData.order.orderNumber);
      setCopySuccess(true);
    }
  };

const handleSubmitReview = async (productId) => {
    try {
      // 1. Get the userId from localStorage
      const savedUserId = localStorage.getItem("userId");

      if (!savedUserId) {
        setNotification({ 
          open: true, 
          message: "User session not found. Please log in again.", 
          severity: "error" 
        });
        return;
      }

      // 2. Prepare the payload (Crucial: Added userId here)
      const reviewData = {
        productId: productId,
        orderId: orderData.order.id,
        userId: Number(savedUserId), // This was missing and caused the NullPointerException
        rating: ratings[productId],
        comment: reviews[productId] || "",
      };

      await reviewApi.createReview(reviewData);
      
      setIsExistingReview(prev => ({ ...prev, [productId]: true }));
      setExpandedReview(prev => ({ ...prev, [productId]: false }));

      setNotification({
        open: true,
        message: isExistingReview[productId] ? "Review updated successfully!" : "Review submitted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Review Error:", err);
      setNotification({
        open: true,
        message: err.response?.data || "Failed to save review.",
        severity: "error",
      });
    }
  };

  const handleCancelOrder = async () => {
    if(!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setActionLoading(true);
      await orderApi.cancelOrder(orderData.order.id); 
      window.location.reload(); 
    } catch (err) {
      alert("Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
  console.log("==== RETURN BUTTON CLICKED ====");

  if (!orderData?.order?.id) {
    console.error("❌ Order ID is missing:", orderData);
    alert("Order ID not found");
    return;
  }

  const confirmAction = window.confirm("Request a return for this order?");
  console.log("User confirmation:", confirmAction);

  if (!confirmAction) return;

  try {
    setActionLoading(true);

    console.log("Sending return request for Order ID:", orderData.order.id);
    console.log("Token:", localStorage.getItem("token"));

    const response = await orderApi.requestReturn(orderData.order.id);

    console.log("✅ Return API response:", response);

    alert("Return request submitted successfully");

    // Instead of reload (better UX)
    setOrderData(prev => ({
      ...prev,
      order: {
        ...prev.order,
        orderStatus: "RETURN_REQUESTED"
      }
    }));

  } catch (err) {
    console.error("❌ Return API ERROR:", err);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }

    alert("Failed to request return. Check console.");
  } finally {
    setActionLoading(false);
    console.log("==== RETURN PROCESS FINISHED ====");
  }
};


  if (loading) return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.primary.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <Typography variant="h6" sx={{ color: theme.palette.secondary.main, letterSpacing: 4, fontFamily: "'Playfair Display', serif" }}>
          RETRIEVING ORDER...
        </Typography>
      </motion.div>
    </Box>
  );

  if (!orderData) return (
    <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5">Order Not Found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
    </Box>
  );

// ===== SMART STEP SELECTOR =====
const orderStatus = orderData.order.orderStatus?.toUpperCase();

// Detect flow type
const isReturnFlow = returnSteps.includes(orderStatus);
const isCancelFlow = orderStatus === "CANCELLED";

// Choose correct steps
const baseSteps = isReturnFlow
  ? returnSteps
  : isCancelFlow
  ? cancelSteps
  : deliverySteps;

// Get current index
const currentStepIndex = baseSteps.indexOf(orderStatus);

  const totalPrice = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Navbar />
      
      <Box sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: theme.palette.primary.contrastText, 
        pt: { xs: 6, md: 8 }, 
        pb: { xs: 8, md: 12 }, 
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div whileHover={{ x: -5 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate(-1)} 
              sx={{ color: theme.palette.secondary.main, mb: 4, letterSpacing: 1 }}
            >
              Back to Orders
            </Button>
          </motion.div>

          <Grid container alignItems="flex-end" justifyContent="space-between">
            <Grid item>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Tooltip title="Click to Copy">
                  <Chip 
                    icon={<ContentCopy style={{ color: theme.palette.secondary.main, fontSize: 14 }} />}
                    label={`ORDER: ${orderData.order.orderNumber}`}
                    onClick={handleCopyId}
                    sx={{ 
                      bgcolor: "rgba(255,255,255,0.05)", 
                      color: theme.palette.secondary.light, 
                      border: `1px solid ${theme.palette.secondary.dark}`, 
                      borderRadius: 1, 
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(216,182,123,0.1)", borderColor: theme.palette.secondary.main }
                    }} 
                  />
                </Tooltip>
                <Chip 
                  label={orderData.order.paymentMethod || "PREPAID"} 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main, 
                    color: theme.palette.primary.main, 
                    fontWeight: "bold", 
                    borderRadius: 1 
                  }} 
                  size="small" 
                />
              </Stack>
              <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                {orderData.order.orderStatus}
              </Typography>
            </Grid>
            <Grid item sx={{ textAlign: "right", mt: {xs: 3, md: 0} }}>
              <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.secondary.main }}>
                ₹{totalPrice.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 2 }}>
                TOTAL AMOUNT
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, position: "relative", zIndex: 10, pb: 10 }}>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
        >
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, mb: 5, borderRadius: 3, 
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            borderTop: `4px solid ${theme.palette.secondary.main}`,
            bgcolor: theme.palette.background.paper
          }}>
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.primary.main, mb: 1 }}>
              Shipment Progress
            </Typography>
            <LuxuryTimeline currentStep={currentStepIndex} steps={baseSteps} />
          </Paper>
        </motion.div>

        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
               <ReceiptLong sx={{ color: theme.palette.primary.main }} />
               <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.primary.main }}>
                  Details
               </Typography>
            </Stack>

            <Stack spacing={4}>
              {orderData.items.map((item, index) => (
                <motion.div 
                  key={item.id || index} 
                  initial={{ y: 30, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <Paper elevation={0} sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" },
                    overflow: "hidden",
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }
                  }}>
                    <Box sx={{ 
                      width: { xs: "100%", sm: "240px" }, 
                      minHeight: "260px",
                      position: "relative",
                      bgcolor: "#f0f0f0",
                      overflow: "hidden"
                    }}>
                      <motion.img 
                        src={item.image} 
                        alt={item.name}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                      <Box sx={{ 
                        position: "absolute", top: 10, left: 10, 
                        bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main, 
                        px: 1.5, py: 0.5, fontSize: "0.75rem", fontWeight: 700, borderRadius: 4
                      }}>
                        x{item.quantity}
                      </Box>
                    </Box>

                    <Box sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                         <Box>
                           <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}>
                             {item.name}
                           </Typography>
                           <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark, fontWeight: 700 }}>
                             ₹{item.price.toLocaleString()}
                           </Typography>
                         </Box>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ flex: 1, mb: 2 }}>
                        <Typography variant="caption" sx={{ color: theme.palette.primary.light, fontWeight: 700, letterSpacing: 1, display: "block", mb: 1 }}>
                          NOTES
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                          {item.description}
                        </Typography>
                      </Box>

                      {orderData.order.orderStatus === "DELIVERED" && (
                        <Box>
                          <Button 
                             onClick={() => setExpandedReview(prev => ({ ...prev, [item.productId]: !prev[item.productId] }))}
                             startIcon={isExistingReview[item.productId] ? <Edit /> : <RateReview />}
                             endIcon={expandedReview[item.productId] ? <ExpandLess /> : <ExpandMore />}
                             sx={{ 
                               color: theme.palette.primary.main, 
                               textTransform: "none", 
                               justifyContent: "flex-start", px: 0,
                               fontWeight: 700,
                               "&:hover": { bgcolor: "transparent", color: theme.palette.secondary.dark } 
                             }}
                          >
                            {isExistingReview[item.productId] 
                                ? (expandedReview[item.productId] ? "Hide My Review" : "View/Edit My Review") 
                                : (expandedReview[item.productId] ? "Close Review" : "Write a Review")}
                          </Button>
                          
                          <AnimatePresence>
                            {expandedReview[item.productId] && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                              >
                                <Box sx={{ 
                                  mt: 2, p: 3, borderRadius: 2, 
                                  border: `1px dashed ${theme.palette.secondary.main}`, 
                                  bgcolor: "rgba(216,182,123,0.05)",
                                  position: 'relative' 
                                }}>
                                  {isExistingReview[item.productId] && (
                                    <Chip 
                                      label="YOUR FEEDBACK" 
                                      size="small" 
                                      sx={{ position: 'absolute', top: -10, right: 10, bgcolor: theme.palette.secondary.main, color: theme.palette.primary.main, fontWeight: 900, fontSize: '0.6rem' }} 
                                    />
                                  )}
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 700 }}>
                                    {isExistingReview[item.productId] ? "Update Your Rating" : "Rate Product"}
                                  </Typography>
                                  <Rating 
                                    value={ratings[item.productId] || 0}
                                    onChange={(e, v) => setRatings(prev => ({...prev, [item.productId]: v}))}
                                    emptyIcon={<StarBorder fontSize="inherit" />}
                                    sx={{ color: theme.palette.secondary.main, mb: 2 }}
                                  />
                                  <TextField 
                                    fullWidth multiline rows={3} 
                                    placeholder="Share your experience..." 
                                    variant="outlined"
                                    value={reviews[item.productId] || ""}
                                    sx={{ bgcolor: theme.palette.background.paper, mb: 2 }}
                                    onChange={(e) => setReviews(prev => ({...prev, [item.productId]: e.target.value}))}
                                  />
                                 <Button 
                                  variant="contained" 
                                  // e.stopPropagation() is vital to prevent the Paper click from firing
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSubmitReview(item.productId);
                                  }}
                                  sx={{ 
                                    borderRadius: 20, 
                                    px: 4, 
                                    mt: 2, 
                                    zIndex: 99, // Ensure it's on top
                                    cursor: 'pointer' 
                                  }}
                                >
                                  {isExistingReview[item.productId] ? "Update Feedback" : "Submit Feedback"}
                                </Button>
                                </Box>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5 }}
              >
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  bgcolor: theme.palette.background.paper, 
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)" 
                }}>
                  <Typography variant="h6" align="center" sx={{ fontFamily: "'Playfair Display', serif", mb: 3, color: theme.palette.primary.main }}>
                    Summary
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Item Total</Typography>
                      <Typography variant="body2" fontWeight={600}>₹{totalPrice.toLocaleString()}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Shipping</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.secondary.dark, fontWeight: 700 }}>COMPLIMENTARY</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Tax</Typography>
                      <Typography variant="body2">Included</Typography>
                    </Stack>
                  </Stack>
                  
                  <Box sx={{ bgcolor: "rgba(74, 46, 46, 0.05)", p: 2, mb: 3, borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.primary.main }}>Total</Typography>
                      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                        ₹{totalPrice.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>

<Stack spacing={2}>
 {["ORDERED", "CONFIRMED", "PACKED"].includes(orderData.order.orderStatus) && (
  <Button
    variant="outlined"
    color="error"
    fullWidth
    onClick={handleCancelOrder}
    disabled={actionLoading}
    startIcon={actionLoading ? <CircularProgress size={20} /> : <CancelOutlined />}
    sx={{ borderRadius: 20 }}
  >
    {actionLoading ? "Cancelling..." : "Cancel Order"}
  </Button>
)}

  {orderData.order.orderStatus === "DELIVERED" && (
    <>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleReturnOrder}
        disabled={actionLoading}
        startIcon={actionLoading ? <CircularProgress size={20} /> : <KeyboardReturn />}
        sx={{ borderRadius: 20 }}
      >
        {actionLoading ? "Processing..." : "Request Return"}
      </Button>

      <DownloadInvoiceButton orderId={orderData.order.id} />
    </>
  )}
</Stack>



                </Paper>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%', bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main }}>
          Order ID copied to clipboard
        </Alert>
      </Snackbar>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default OrderDetail;