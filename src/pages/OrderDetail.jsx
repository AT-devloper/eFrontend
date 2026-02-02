import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Chip,
  Grid,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import sellerApi from "../api/sellerApi";

// 🔥 Import Navbar and Footer
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState({});
  const [productReviews, setProductReviews] = useState({});

  // Base steps
  const baseSteps = ["ORDERED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  // Return steps
  const returnSteps = ["RETURN_INITIATED", "RETURNED"];
  const statusLabels = {
    ORDERED: "Ordered",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    RETURN_INITIATED: "Return Initiated",
    RETURNED: "Returned",
    CANCELLED: "Cancelled",
  };

  const statusStyles = {
    ORDERED: { border: "#FFD700" },
    CONFIRMED: { border: "#FFD700" },
    PACKED: { border: "#1E90FF" },
    SHIPPED: { border: "#32CD32" },
    OUT_FOR_DELIVERY: { border: "#1E90FF" },
    DELIVERED: { border: "#32CD32" },
    RETURN_INITIATED: { border: "#FFB400" },
    RETURNED: { border: "#FF4500" },
    CANCELLED: { border: "#FF4500" },
  };

  const getStatusStyle = (status) =>
    statusStyles[status?.toUpperCase()] || { border: "#9E9E9E" };

  const fetchOrderDetail = async () => {
    try {
      const res = await fetch(`http://localhost:8080/auth/orders/${orderNumber}`);
      const data = await res.json();

      const itemsWithImages = await Promise.all(
        data.items.map(async (item) => {
          try {
            const images = await sellerApi.getProductImages(item.productId);
            return { ...item, image: images[0]?.imageUrl || "/placeholder.png" };
          } catch {
            return { ...item, image: "/placeholder.png" };
          }
        })
      );

      setOrderData({ ...data, items: itemsWithImages });
      setLoading(false);

      data.items.forEach((item) => fetchProductReviews(item.productId));
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8080/auth/reviews/product/${productId}`);
      const data = await res.json();
      setProductReviews((prev) => ({ ...prev, [productId]: data }));
    } catch (err) {
      console.error("Failed to fetch product reviews", err);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderNumber]);

  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmitReview = async (productId) => {
    const review = reviews[productId];
    if (!review || review.trim() === "") return alert("Please enter a review");

    try {
      await fetch(`http://localhost:8080/auth/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, review, rating: 5 }),
      });
      alert("Review submitted successfully!");
      setReviews((prev) => ({ ...prev, [productId]: "" }));
      fetchProductReviews(productId);
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <Typography textAlign="center">Loading order details...</Typography>;
  if (!orderData) return <Typography textAlign="center">Order not found.</Typography>;

  const orderStatus = orderData.order.orderStatus.toUpperCase();
  const isDelivered = orderStatus === "DELIVERED";
  const canCancel = ["CONFIRMED", "PACKED"].includes(orderStatus);

  // Construct dynamic steps
  let steps = [...baseSteps];
  if (orderData.order.returnStatus) {
    steps = [...steps, ...returnSteps];
  }

  let currentStep = steps.findIndex((step) => step === orderStatus);

  const handleCancelOrder = () => {
    if (!canCancel) return alert("Cannot cancel at this stage!");
    alert("Order cancelled at " + orderData.order.orderStatus);
  };

  const handleReturnOrder = () => {
    alert("Return process initiated!");
  };

  return (
    <>
      {/* 🔥 Add Navbar */}
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back
        </Button>

        <Card sx={{ borderRadius: 3, backgroundColor: "background.paper", mb: 3 }}>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center" mb={1}>
              <Grid item>
                <Typography variant="h5">{`Order No: ${orderData.order.orderNumber}`}</Typography>
              </Grid>
              <Grid item>
                <Chip
                  label={orderData.order.orderStatus}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    color: getStatusStyle(orderData.order.orderStatus).border,
                    borderColor: getStatusStyle(orderData.order.orderStatus).border,
                    backgroundColor: "transparent",
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Payment ID: {orderData.order.paymentId || "Not Paid"}
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((status, index) => {
                const stepColor = index <= currentStep ? getStatusStyle(status).border : "#E0E0E0";
                return (
                  <Step key={status}>
                    <StepLabel sx={{ color: stepColor }}>{statusLabels[status]}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {canCancel && orderStatus !== "CANCELLED" && (
              <Button variant="contained" color="error" onClick={handleCancelOrder} sx={{ mb: 2 }}>
                Cancel Order
              </Button>
            )}

            {isDelivered && !orderData.order.returnStatus && (
              <Button variant="contained" color="warning" onClick={handleReturnOrder} sx={{ mb: 2 }}>
                Return Order
              </Button>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, backgroundColor: "background.paper" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Products
            </Typography>

            <List dense>
              {orderData.items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "text.secondary",
                    py: 1,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 16 }}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <Typography variant="body1" fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2">Product ID: {item.productId}</Typography>
                    {item.variants && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {Object.entries(item.variants).map(([key, value]) => (
                          <Chip key={key} label={`${key}: ${value}`} size="small" />
                        ))}
                      </div>
                    )}
                    {isDelivered && (
                      <div style={{ marginTop: 8 }}>
                        <TextField
                          label="Write a review"
                          variant="outlined"
                          size="small"
                          fullWidth
                          multiline
                          rows={2}
                          value={reviews[item.productId] || ""}
                          onChange={(e) => setReviews((prev) => ({ ...prev, [item.productId]: e.target.value }))}
                          sx={{ mb: 1 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSubmitReview(item.productId)}
                        >
                          Submit Review
                        </Button>

                        {productReviews[item.productId]?.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Typography variant="subtitle2">Reviews:</Typography>
                            {productReviews[item.productId].map((r) => (
                              <Typography key={r.id} variant="body2">"{r.review}"</Typography>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <Typography>Qty: {item.quantity}</Typography>
                    <Typography>₹{item.price}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "right" }}>
              Total: ₹{calculateTotal(orderData.items)}
            </Typography>
          </CardContent>
        </Card>
      </Container>

      {/* 🔥 Add Footer */}
      <Footer />
    </>
  );
};

export default OrderDetail;
