import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  List,
  ListItem,
  Divider,
  Grid,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import sellerApi from "../api/sellerApi";

const MyOrders = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const statusStyles = {
    CONFIRMED: { border: "#FFD700" },
    PACKED: { border: "#1E90FF" },
    DELIVERED: { border: "#32CD32" },
    CANCELLED: { border: "#FF4500" },
    RETURN_REQUESTED: { border: "#9932CC" },
  };

  const getStatusStyle = (status) =>
    statusStyles[status?.toUpperCase()] || { border: "#9E9E9E" };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `http://localhost:8080/auth/orders/user/${user.id}`
      );
      const data = await res.json();

      // Attach images to each product
      const ordersWithImages = await Promise.all(
        data.map(async ({ order, items }) => {
          const itemsWithImages = await Promise.all(
            items.map(async (item) => {
              try {
                const images = await sellerApi.getProductImages(item.productId);
                return {
                  ...item,
                  image: images[0]?.imageUrl || "/placeholder.png",
                };
              } catch {
                return { ...item, image: "/placeholder.png" };
              }
            })
          );
          return { order, items: itemsWithImages };
        })
      );

      setOrders(ordersWithImages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const requestReturn = async (orderId) => {
    try {
      await fetch(`http://localhost:8080/auth/orders/${orderId}/return`, {
        method: "PUT",
      });
      setActionMsg("✅ Return requested successfully!");
      fetchOrders();
    } catch {
      setActionMsg("❌ Failed to request return");
    }
  };

  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          My Orders
        </Typography>

        {actionMsg && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {actionMsg}
          </Alert>
        )}

        {loading && <Typography textAlign="center">Loading orders...</Typography>}

        {!loading && orders.length === 0 && (
          <Typography textAlign="center">No orders found.</Typography>
        )}

        <Stack spacing={3}>
          {orders.map(({ order, items }) => (
            <Card
              key={order.id}
              sx={{
                position: "relative",
                borderRadius: 3,
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 6,
                  height: "100%",
                  backgroundColor: getStatusStyle(order.orderStatus).border,
                },
              }}
              onClick={() => navigate(`/my-orders/${order.orderNumber}`)}
            >
              <CardContent sx={{ pl: 3 }}>
                <Grid container justifyContent="space-between" mb={1}>
                  <Typography variant="h6">
                    Order No: {order.orderNumber}
                  </Typography>
                  <Chip
                    label={order.orderStatus}
                    variant="outlined"
                    sx={{
                      color: getStatusStyle(order.orderStatus).border,
                      borderColor: getStatusStyle(order.orderStatus).border,
                      fontWeight: 600,
                    }}
                  />
                </Grid>

                <List dense>
                  {items.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.productId}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>
                          Product ID: {item.productId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity} × ₹{item.price}
                        </Typography>
                      </Box>

                      <Typography fontWeight={600}>
                        ₹{item.price * item.quantity}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 1 }} />

                <Typography textAlign="right" fontWeight={600}>
                  Total: ₹{calculateTotal(items)}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  {order.orderStatus?.toUpperCase() === "DELIVERED" && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        requestReturn(order.id);
                      }}
                    >
                      Return
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      <Footer />
    </>
  );
};

export default MyOrders;
