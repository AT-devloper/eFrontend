import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
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

  const statusColors = {
    CONFIRMED: { main: "#ed6c02", bg: "#fff7ed" },
    PACKED: { main: "#0288d1", bg: "#f0f9ff" },
    DELIVERED: { main: "#2e7d32", bg: "#f0fdf4" },
    CANCELLED: { main: "#d32f2f", bg: "#fef2f2" },
    RETURN_REQUESTED: { main: "#9c27b0", bg: "#faf5ff" },
  };

  const getStatusStyle = (status) =>
    statusColors[status?.toUpperCase()] || { main: "#757575", bg: "#f5f5f5" };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/auth/orders/user/${user.id}`);
      const data = await res.json();
      const ordersWithImages = await Promise.all(
        data.map(async ({ order, items }) => {
          const itemsWithImages = await Promise.all(
            items.map(async (item) => {
              try {
                const images = await sellerApi.getProductImages(item.productId);
                return { ...item, image: images[0]?.imageUrl || "/placeholder.png" };
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

  useEffect(() => { fetchOrders(); }, [user]);

  const requestReturn = async (orderId) => {
    try {
      await fetch(`http://localhost:8080/auth/orders/${orderId}/return`, { method: "PUT" });
      setActionMsg("✅ Return requested successfully!");
      fetchOrders();
    } catch {
      setActionMsg("❌ Failed to request return");
    }
  };

  return (
    <Box sx={{ bgcolor: "#F4F7F9", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#1A2027", letterSpacing: "-1px" }}>
            Order History
          </Typography>
          <Typography variant="body1" sx={{ color: "#5F6E7C", mt: 1 }}>
            Track, manage, and view details of your purchases
          </Typography>
        </Box>

        {actionMsg && <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>{actionMsg}</Alert>}

        {loading ? (
          <Typography textAlign="center">Updating your list...</Typography>
        ) : orders.length === 0 ? (
          <Typography textAlign="center" sx={{ py: 10, color: "#999" }}>No orders found in your account.</Typography>
        ) : (
          <Stack spacing={4}>
            {orders.map(({ order, items }) => {
              const style = getStatusStyle(order.orderStatus);
              const totalAmount = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

              return (
                <Card 
                  key={order.id} 
                  sx={{ 
                    borderRadius: 5, 
                    boxShadow: "0 10px 40px rgba(0,0,0,0.04)", 
                    border: "1px solid #E5EAF2",
                    overflow: "visible",
                    position: "relative"
                  }}
                >
                  {/* Status Tag Floated Right */}
                  <Box sx={{ position: "absolute", top: -15, right: 20 }}>
                    <Chip 
                      label={order.orderStatus} 
                      sx={{ 
                        bgcolor: style.main, 
                        color: "white", 
                        fontWeight: 800, 
                        px: 2,
                        boxShadow: `0 4px 14px ${style.main}44`
                      }} 
                    />
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Left: Product Images Stack */}
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: "flex", position: "relative", height: 80 }}>
                          {items.slice(0, 3).map((item, idx) => (
                            <Box
                              key={idx}
                              component="img"
                              src={item.image}
                              sx={{
                                width: 70, height: 70, borderRadius: 3, objectFit: "cover",
                                border: "3px solid white", position: "absolute",
                                left: idx * 25, zIndex: 3 - idx,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                              }}
                            />
                          ))}
                        </Box>
                      </Grid>

                      {/* Middle: Order Info */}
                      <Grid item xs={12} sm={5}>
                        <Typography variant="caption" sx={{ color: "#9EA9B7", fontWeight: 700, textTransform: "uppercase" }}>
                          Order ID: #{order.orderNumber}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, my: 0.5 }}>
                          {items.length} {items.length === 1 ? 'Item' : 'Items'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#5F6E7C" }}>
                          Total Amount: <span style={{ fontWeight: 700, color: "#1A2027" }}>₹{totalAmount}</span>
                        </Typography>
                      </Grid>

                      {/* Right: Actions */}
                      <Grid item xs={12} sm={4} sx={{ textAlign: { sm: "right" } }}>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                          {order.orderStatus === "DELIVERED" && (
                            <Button 
                              variant="text" 
                              color="inherit" 
                              onClick={() => requestReturn(order.id)}
                              sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#666" }}
                            >
                              Return
                            </Button>
                          )}
                          <Button 
                            variant="contained"
                            disableElevation
                            onClick={() => navigate(`/my-orders/${order.orderNumber}`)}
                            sx={{ 
                              bgcolor: "#1A2027", borderRadius: 3, px: 3, py: 1,
                              textTransform: "none", fontWeight: 700,
                              "&:hover": { bgcolor: "#333" }
                            }}
                          >
                            Details &rarr;
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ borderStyle: "dashed" }} />
                  
                  {/* Subtle footer inside card */}
                  <Box sx={{ px: 4, py: 1.5, bgcolor: "#F9FAFB", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <Typography variant="caption" sx={{ color: "#9EA9B7" }}>
                      Transaction completed securely. Need help? Contact Support.
                    </Typography>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default MyOrders;