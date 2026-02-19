import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
  Skeleton,
  Fab,
  Zoom,
  useScrollTrigger,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  ArrowForward,
  LocalShippingOutlined,
  CheckCircleOutline,
  CancelOutlined,
  ReplayOutlined,
  Inventory2Outlined,
  KeyboardArrowUp,
  Sort,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import sellerApi from "../api/sellerApi";
import orderApi from "../api/orderApi";


// --- Configuration ---
const STATUS_CONFIG = {
  // ===== NORMAL ORDER FLOW =====
  ORDERED: {
    label: "Ordered",
    color: "#64748b",
    bg: "#f1f5f9",
    icon: <Inventory2Outlined sx={{ fontSize: 14 }} />,
  },

  CONFIRMED: {
    label: "Confirmed",
    color: "#475569",
    bg: "#f1f5f9",
    icon: <Inventory2Outlined sx={{ fontSize: 14 }} />,
  },

  PACKED: {
    label: "Packed",
    color: "#334155",
    bg: "#e2e8f0",
    icon: <Inventory2Outlined sx={{ fontSize: 14 }} />,
  },

  SHIPPED: {
    label: "In Transit",
    color: "#0284c7",
    bg: "#e0f2fe",
    icon: <LocalShippingOutlined sx={{ fontSize: 14 }} />,
  },

  OUT_FOR_DELIVERY: {
  label: "Out for Delivery",
  color: "#d97706",        // amber-600
  bg: "#fef3c7",           // amber-100
  icon: <LocalShippingOutlined sx={{ fontSize: 14 }} />,
  },

  DELIVERED: {
    label: "Delivered",
    color: "#059669",
    bg: "#dcfce7",
    icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
  },

  // ===== CANCELLED =====
  CANCELLED: {
    label: "Cancelled",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: <CancelOutlined sx={{ fontSize: 14 }} />,
  },

  // ===== RETURN FLOW =====
  RETURN_REQUESTED: {
    label: "Return Requested",
    color: "#db2777",
    bg: "#fce7f3",
    icon: <ReplayOutlined sx={{ fontSize: 14 }} />,
  },

  RETURN_APPROVED: {
    label: "Return Approved",
    color: "#9333ea",
    bg: "#f3e8ff",
    icon: <ReplayOutlined sx={{ fontSize: 14 }} />,
  },

  RETURN_PICKED: {
    label: "Return Picked",
    color: "#ea580c",
    bg: "#ffedd5",
    icon: <LocalShippingOutlined sx={{ fontSize: 14 }} />,
  },

  RETURN_COMPLETED: {
    label: "Return Completed",
    color: "#059669",
    bg: "#dcfce7",
    icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
  },
};


const formatCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// --- 🔧 BULLETPROOF DATE PARSER ---
const getTimestamp = (dateInput) => {
  if (!dateInput) return 0;
  try {
    // 1. Handle Java/Backend Arrays: [2024, 2, 20, 14, 30] -> Year, Month, Day, Hour, Min
    if (Array.isArray(dateInput)) {
      return new Date(
        dateInput[0],
        (dateInput[1] || 1) - 1, // Month is 0-indexed in JS
        dateInput[2] || 1,
        dateInput[3] || 0,
        dateInput[4] || 0,
        dateInput[5] || 0
      ).getTime();
    }
    // 2. Handle Strings (ISO) or Numbers (Timestamp)
    const timestamp = new Date(dateInput).getTime();
    return isNaN(timestamp) ? 0 : timestamp;
  } catch (e) {
    return 0;
  }
};

// --- Scroll Top Button ---
const ScrollTop = ({ children }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });
  const handleClick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <Zoom in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 99 }}>
        {children}
      </Box>
    </Zoom>
  );
};

// --- Barcode UI ---
const Barcode = () => (
  <Box sx={{ display: "flex", height: 12, opacity: 0.2, gap: "2px", justifyContent: "center", mb: 1.5, mt: 1 }}>
    {[...Array(15)].map((_, i) => (
      <Box key={i} sx={{ width: Math.random() > 0.5 ? 1 : 3, bgcolor: "black" }} />
    ))}
  </Box>
);

// --- Ticket Card (Wrapped in motion.div for Shuffle) ---
const TicketCard = React.memo(({ order, items, navigate }) => {
  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.CONFIRMED;
  const total = useMemo(() => items.reduce((a, b) => a + b.price * b.quantity, 0), [items]);

  return (
    <motion.div
      layout // ⚡ This enables the shuffle animation
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      style={{ marginBottom: '20px' }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "white",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #f1f5f9",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            borderColor: "#cbd5e1",
          },
        }}
      >
        {/* Left Info */}
        <Box sx={{ flex: 1, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <Box>
               <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                 Tracking ID
               </Typography>
               <Typography variant="subtitle1" sx={{ fontFamily: "monospace", fontWeight: 700, color: "#334155", lineHeight: 1 }}>
                 #{order.orderNumber}
               </Typography>
             </Box>
             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                          {items.length} {items.length === 1 ? 'Item' : 'Items'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Standard Shipping
                      </Typography>
                  </Box>
                  <AvatarGroup 
                    max={3} 
                    sx={{ "& .MuiAvatar-root": { width: 42, height: 42, border: "2px solid white", bgcolor: "#f1f5f9", fontSize: "0.8rem" } }}
                  >
                    {items.map((item, i) => (
                      <Avatar key={i} src={item.image} alt="Item" />
                    ))}
                  </AvatarGroup>
             </Box>
          </Box>
        </Box>

        {/* Perforations */}
        <Box sx={{ width: "2px", display: { xs: "none", md: "block" }, position: "relative", backgroundImage: "linear-gradient(to bottom, #e2e8f0 50%, transparent 50%)", backgroundSize: "2px 10px", backgroundRepeat: "repeat-y" }}>
          <Box sx={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, borderRadius: "50%", bgcolor: "#f8fafc" }} />
          <Box sx={{ position: "absolute", bottom: -6, left: -6, width: 12, height: 12, borderRadius: "50%", bgcolor: "#f8fafc" }} />
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" }, height: "1px", position: "relative" }}>
           <Box sx={{ width: "100%", height: "1px", borderBottom: "2px dashed #e2e8f0" }} />
        </Box>

        {/* Right Action */}
        <Box sx={{ width: { xs: "100%", md: "200px" }, bgcolor: "#fafafa", p: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Chip icon={status.icon} label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.7rem", borderRadius: "4px", mb: 1, height: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, lineHeight: 1.2 }}>
              {formatCurrency.format(total)}
          </Typography>
          <Barcode />
          <Button
              size="small" fullWidth variant="contained" 
              onClick={() => navigate(`/my-orders/${order.orderNumber}`)}
              endIcon={<ArrowForward sx={{ fontSize: "14px !important" }} />}
              sx={{ bgcolor: "#0f172a", color: "#fff", py: 0.5, fontSize: "0.75rem", fontWeight: 600, borderRadius: 1.5, textTransform: "none", minHeight: 32, "&:hover": { bgcolor: "#334155" } }}
          >
              Details
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

const MyOrders = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch Logic
const fetchOrders = useCallback(async () => {
  if (!user?.id) return;

  setLoading(true);

  try {
    const data = await orderApi.getUserOrders(user.id);

    if (!Array.isArray(data)) {
      setOrders([]);
      return;
    }

    const uniqueProductIds = new Set();
    data.forEach((orderBlock) => {
      orderBlock?.items?.forEach((item) => {
        if (item?.productId) {
          uniqueProductIds.add(item.productId);
        }
      });
    });

    const imageMap = new Map();

    await Promise.all(
      Array.from(uniqueProductIds).map(async (pid) => {
        try {
          const imgs = await sellerApi.getProductImages(pid);
          imageMap.set(pid, imgs?.[0]?.imageUrl || "");
        } catch {
          imageMap.set(pid, "");
        }
      })
    );

    const processed = data.map((block) => ({
      order: block?.order || {},
      items: (block?.items || []).map((item) => ({
        ...item,
        image: imageMap.get(item.productId) || "",
      })),
    }));

    setOrders(processed);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
}, [user]);


  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // --- 🔧 SORTING LOGIC ---
  const sortedOrders = useMemo(() => {
    if (!orders.length) return [];
    
    // Create a shallow copy so we don't mutate original state
    return [...orders].sort((a, b) => {
      const timeA = getTimestamp(a.order.orderDate);
      const timeB = getTimestamp(b.order.orderDate);
      
      if (timeA !== timeB) {
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      }
      // Fallback: If dates are exact same, sort by ID to ensure stability
      return sortOrder === "desc" 
        ? b.order.id - a.order.id 
        : a.order.id - b.order.id;
    });
  }, [orders, sortOrder]);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        
        {/* Header and Filter */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>
                  Order History
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                   Manage your purchases.
                </Typography>
            </Box>

            {/* Filter Dropdown */}
            <FormControl variant="standard" sx={{ minWidth: 150 }}>
                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    disableUnderline
                    IconComponent={Sort}
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        py: 0.5,
                        "& .MuiSelect-select": { display: "flex", alignItems: "center" }
                    }}
                >
                    <MenuItem value="desc">Newest First</MenuItem>
                    <MenuItem value="asc">Oldest First</MenuItem>
                </Select>
            </FormControl>
        </Stack>

        {/* List Content */}
        {loading ? (
            <Stack spacing={2}>
                <Skeleton height={140} variant="rectangular" sx={{ borderRadius: 3 }} />
                <Skeleton height={140} variant="rectangular" sx={{ borderRadius: 3 }} />
            </Stack>
        ) : sortedOrders.length === 0 ? (
            <Box textAlign="center" py={12} sx={{ opacity: 0.6 }}>
                <Inventory2Outlined sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No orders found.</Typography>
            </Box>
        ) : (
            // Animation Wrapper
            <AnimatePresence mode="popLayout">
                {sortedOrders.map((data) => (
                    <TicketCard key={data.order.id} {...data} navigate={navigate} />
                ))}
            </AnimatePresence>
        )}
      </Container>
      
 

      <Footer />
    </Box>
  );
};

export default MyOrders;