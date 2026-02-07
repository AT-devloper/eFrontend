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
  Rating,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import sellerApi from "../api/sellerApi";

// 🔥 Import Navbar and Footer
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState({}); // comment input
  const [ratings, setRatings] = useState({}); // rating input
  const [productReviews, setProductReviews] = useState({}); // fetched reviews
  const [editingReviewId, setEditingReviewId] = useState(null); // tracks ID being edited

  const BASE_URL = "http://localhost:8080/auth/reviews";

  // Base steps
  const baseSteps = ["ORDERED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
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
      // Fetch reviews for each product after order details are loaded
      itemsWithImages.forEach((item) => fetchProductReviews(item.productId));
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${productId}`);
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
    const comment = reviews[productId];
    const rating = ratings[productId];

    if (!comment || comment.trim() === "") return alert("Please enter a review");
    if (!rating || rating === 0) return alert("Please select a rating");

    // 🔥 Switch between POST (new) and PUT (update)
    const method = editingReviewId ? "PUT" : "POST";
    const url = editingReviewId ? `${BASE_URL}/${editingReviewId}` : BASE_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: orderData.order.userId,
          orderId: orderData.order.id,
          productId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        // Reset states
        setReviews((prev) => ({ ...prev, [productId]: "" }));
        setRatings((prev) => ({ ...prev, [productId]: 0 }));
        setEditingReviewId(null);

        fetchProductReviews(productId);
        alert(editingReviewId ? "Review updated!" : "Review submitted!");
      } else {
        alert("Failed to save review");
      }
    } catch (err) {
      console.error("Failed to process review", err);
    }
  };

  const handleDeleteReview = async (reviewId, productId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        fetchProductReviews(productId);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditClick = (review, productId) => {
    setEditingReviewId(review.id);
    setRatings((prev) => ({ ...prev, [productId]: review.rating }));
    setReviews((prev) => ({ ...prev, [productId]: review.comment }));
  };

  if (loading) return <Typography textAlign="center">Loading order details...</Typography>;
  if (!orderData) return <Typography textAlign="center">Order not found.</Typography>;

  const orderStatus = orderData.order.orderStatus.toUpperCase();
  const isDelivered = orderStatus === "DELIVERED";
  const canCancel = ["CONFIRMED", "PACKED"].includes(orderStatus);

  let steps = [...baseSteps];
  if (orderData.order.returnStatus) steps = [...steps, ...returnSteps];
  let currentStep = steps.findIndex((step) => step === orderStatus);

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back
        </Button>

        {/* Order Info Card */}
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
                  }}
                />
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Payment ID: {orderData.order.paymentId || "Not Paid"}
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((status, index) => (
                <Step key={status}>
                  <StepLabel sx={{ color: index <= currentStep ? getStatusStyle(status).border : "#E0E0E0" }}>
                    {statusLabels[status]}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {canCancel && orderStatus !== "CANCELLED" && (
              <Button variant="contained" color="error" onClick={() => alert("Cancelled")} sx={{ mb: 2 }}>
                Cancel Order
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card sx={{ borderRadius: 3, backgroundColor: "background.paper" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Products</Typography>
            <List dense>
              {orderData.items.map((item) => (
                <ListItem key={item.id} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, py: 2, alignItems: 'flex-start' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>{item.name}</Typography>
                    
                    {isDelivered && (
                      <div style={{ marginTop: 8 }}>
                        <Rating
                          value={ratings[item.productId] || 0}
                          onChange={(e, v) => setRatings((prev) => ({ ...prev, [item.productId]: v }))}
                        />
                        <TextField
                          label={editingReviewId ? "Edit your review" : "Write a review"}
                          variant="outlined" size="small" fullWidth multiline rows={2}
                          value={reviews[item.productId] || ""}
                          onChange={(e) => setReviews((prev) => ({ ...prev, [item.productId]: e.target.value }))}
                          sx={{ mb: 1, mt: 1 }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="contained" size="small" onClick={() => handleSubmitReview(item.productId)}>
                            {editingReviewId ? "Update Review" : "Submit Review"}
                          </Button>
                          {editingReviewId && (
                            <Button size="small" color="inherit" onClick={() => {setEditingReviewId(null); setReviews({}); setRatings({});}}>
                              Cancel
                            </Button>
                          )}
                        </div>

                        {/* Display Reviews for this Product */}
                        {productReviews[item.productId]?.map((r) => (
                          <div key={r.id} style={{ marginTop: 10, padding: 8, background: '#f9f9f9', borderRadius: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Rating value={r.rating} readOnly size="small" />
                              <div>
                                <IconButton size="small" color="primary" onClick={() => handleEditClick(r, item.productId)}>
                                  <EditIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteReview(r.id, item.productId)}>
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </div>
                            </div>
                            <Typography variant="body2" color="textPrimary">"{r.comment}"</Typography>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", minWidth: '80px' }}>
                    <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                    <Typography variant="body1" fontWeight={600}>₹{item.price}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ textAlign: "right", fontWeight: 700 }}>
              Total: ₹{calculateTotal(orderData.items)}
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default OrderDetail;