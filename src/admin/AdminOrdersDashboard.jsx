import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Divider,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import {
  Search,
  Refresh,
  Close,
  ArrowForward,
  Inventory,
  Person,
  Save,
  CreditCard,
  FilterList
} from "@mui/icons-material";
import orderApi from "../api/orderApi";

// --- IMPORT FRAMER MOTION ---
import { motion, AnimatePresence } from "framer-motion";

// --- STATUS CONFIG ---
const STATUS_STEPS = {
  ORDERED: { val: 10, label: "Ordered", color: "primary" },
  CONFIRMED: { val: 25, label: "Confirmed", color: "info" },
  PACKED: { val: 50, label: "Packed", color: "secondary" },
  SHIPPED: { val: 75, label: "Shipped", color: "warning" },
  OUT_FOR_DELIVERY: { val: 90, label: "Out for Delivery", color: "warning" },
  DELIVERED: { val: 100, label: "Delivered", color: "success" },
  CANCELLED: { val: 100, label: "Cancelled", color: "error" },
  RETURN_REQUESTED: { val: 100, label: "Return Requested", color: "error" },
  RETURN_APPROVED: { val: 100, label: "Return Approved", color: "info" },
  RETURN_PICKED: { val: 100, label: "Return Picked", color: "warning" },
  RETURN_COMPLETED: { val: 100, label: "Return Completed", color: "success" },
};

const RETURN_FLOW = ["RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_PICKED", "RETURN_COMPLETED"];

const CATEGORIES = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Issues", value: "ISSUES" }
];

const AdminOrdersDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // NEW: State for 3-way sorting
  const [sortOrder, setSortOrder] = useState("DEFAULT"); // "DEFAULT" | "LOW_TO_HIGH" | "HIGH_TO_LOW"

  const [viewOrder, setViewOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setNotification({ open: true, message: "Failed to load orders", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- FILTER & SORT WITH MEMO ---
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      result = result.filter(o => o.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (tabValue === "ACTIVE") {
      result = result.filter(o => ["ORDERED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY"].includes(o.order.orderStatus));
    } else if (tabValue === "COMPLETED") {
      result = result.filter(o => ["DELIVERED", "RETURN_COMPLETED"].includes(o.order.orderStatus));
    } else if (tabValue === "ISSUES") {
      result = result.filter(o => ["CANCELLED", "RETURN_REQUESTED"].includes(o.order.orderStatus));
    }

    // UPDATED: 3-Way Sort Logic
    result.sort((a, b) => {
      const totalA = (a.items || []).reduce((acc, i) => acc + (i.price * i.quantity), 0);
      const totalB = (b.items || []).reduce((acc, i) => acc + (i.price * i.quantity), 0);

      if (sortOrder === "LOW_TO_HIGH") return totalA - totalB;
      if (sortOrder === "HIGH_TO_LOW") return totalB - totalA;
      
      // Default Sort: Newest First
      return new Date(b.order.orderDate) - new Date(a.order.orderDate);
    });

    return result;
  }, [orders, searchTerm, tabValue, sortOrder]);

  const handleRowClick = (rowData) => {
    if (!rowData || !rowData.order) return;
    const items = rowData.items || [];
    const totalPrice = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    setViewOrder({ ...rowData.order, items, totalPrice });
    setPendingStatus(rowData.order.orderStatus);
    setDrawerOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!viewOrder) return;
    setIsUpdating(true);
    try {
      await orderApi.updateOrderStatus(viewOrder.id, pendingStatus);
      setViewOrder(prev => ({ ...prev, orderStatus: pendingStatus }));
      setNotification({ open: true, message: "Status Updated Successfully", severity: "success" });
      fetchOrders();
    } catch (err) {
      setNotification({ open: true, message: "Update Failed", severity: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, pb: 4 }}>
      
      {/* TOP BAR */}
      <Paper elevation={0} sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderRadius: 0, pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl" disableGutters>
          <Stack direction={{xs: "column", md: "row"}} justifyContent="space-between" alignItems={{xs: "flex-start", md: "center"}} spacing={3}>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>Order Dashboard</Typography>
            </Box>
            
            <Stack direction={{xs: "column", sm: "row"}} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
              <TextField 
                placeholder="Search Order ID..." 
                size="small" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth={isMobile}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start"><Search sx={{ color: theme.palette.text.secondary }} /></InputAdornment>,
                  sx: { bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 2, '& fieldset': { border: 'none' } } 
                }}
              />
              
              <Stack direction="row" spacing={1}>
                {/* 3-WAY SORTING DROPDOWN (Styled like a button) */}
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    displayEmpty
                    startAdornment={<InputAdornment position="start"><FilterList sx={{ color: "inherit", ml: 0.5 }} /></InputAdornment>}
                    sx={{ 
                      bgcolor: sortOrder !== "DEFAULT" ? theme.palette.secondary.main : "transparent",
                      color: sortOrder !== "DEFAULT" ? "#fff" : "inherit",
                      border: sortOrder !== "DEFAULT" ? "none" : "1px solid rgba(255,255,255,0.5)",
                      borderRadius: 2, 
                      fontWeight: 700,
                      '& fieldset': { border: 'none' },
                      '.MuiSelect-select': { py: 1 },
                      '.MuiSvgIcon-root': { color: "inherit" } // Makes dropdown arrow match text color
                    }}
                  >
                    <MenuItem value="DEFAULT">Sort: Default</MenuItem>
                    <MenuItem value="LOW_TO_HIGH">Price: Low to High</MenuItem>
                    <MenuItem value="HIGH_TO_LOW">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" onClick={fetchOrders} sx={{ minWidth: 50, fontWeight: 700 }}>
                  <Refresh />
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ mt: -5 }} disableGutters={isMobile}>
        <Paper elevation={isMobile ? 0 : 3} sx={{ borderRadius: { xs: 0, md: 3 }, overflow: "hidden", border: {xs: "none", md: "1px solid #e2e8f0"}, bgcolor: theme.palette.background.paper, minHeight: "60vh" }}>
          
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: theme.palette.background.paper }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary" sx={{ px: 2 }}>
              {CATEGORIES.map((cat) => (
                <Tab key={cat.value} label={cat.label} value={cat.value} sx={{ fontWeight: 600, textTransform: "none", py: 2 }} />
              ))}
            </Tabs>
          </Box>

          {filteredOrders.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center', color: theme.palette.text.secondary }}><Typography>No orders found.</Typography></Box>
          ) : isMobile ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              {/* ANIMATED PRESENCE FOR MOBILE CARDS */}
              <AnimatePresence>
                {filteredOrders.map((row) => {
                  const order = row.order || {};
                  const items = row.items || [];
                  const totalPrice = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                  const statusData = STATUS_STEPS[order.orderStatus] || { val: 0, label: order.orderStatus, color: "primary" };
                  if (!order.id) return null;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                      key={order.id} 
                    >
                      <Paper onClick={() => handleRowClick({order, items, totalPrice})} sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0", cursor: "pointer" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="subtitle1" fontWeight={700}>#{order.orderNumber}</Typography>
                          <Chip label={statusData.label} color={statusData.color} size="small" variant="filled" sx={{ height: 24, fontWeight: 700 }} />
                        </Stack>
                        <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="caption" color="text.secondary">CUSTOMER</Typography>
                            <Typography variant="body2" fontWeight={600}>{order.userId || "Guest"}</Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary">TOTAL</Typography>
                            <Typography variant="h6" fontWeight={800} color="primary.main">₹{totalPrice.toLocaleString()}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          ) : (
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ORDER DETAILS</TableCell>
                    <TableCell>CUSTOMER</TableCell>
                    <TableCell>PROGRESS</TableCell>
                    <TableCell align="right">TOTAL</TableCell>
                    <TableCell align="right">ACTION</TableCell>
                  </TableRow>
                </TableHead>
                {/* ANIMATED PRESENCE FOR DESKTOP TABLE */}
                <TableBody component={motion.tbody}>
                  <AnimatePresence>
                    {filteredOrders.map((row) => {
                      const order = row.order || {};
                      const items = row.items || [];
                      const totalPrice = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                      const statusData = STATUS_STEPS[order.orderStatus] || { val: 0, label: order.orderStatus, color: "primary" };
                      if (!order.id) return null;

                      return (
                        <TableRow 
                          component={motion.tr}
                          layout 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          key={order.id} 
                          hover 
                          sx={{ cursor: "pointer" }} 
                          onClick={() => handleRowClick({order, items, totalPrice})}
                        >
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar variant="rounded" sx={{ bgcolor: theme.palette.secondary.light, color: theme.palette.text.primary }}><Inventory fontSize="small" /></Avatar>
                              <Typography variant="subtitle2" fontWeight={700}>#{order.orderNumber}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{order.userId || "Guest"}</Typography>
                            <Typography variant="caption" color={theme.palette.text.secondary}>{items.length} Items</Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                              <Typography variant="caption" fontWeight={700} color={statusData.color === 'error' ? 'error' : 'text.primary'}>{statusData.label}</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={statusData.val} color={statusData.color} sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9" }} />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800 }}>₹{totalPrice.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Button variant="outlined" size="small" sx={{ borderRadius: 20 }}>View</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
      
      {/* DRAWER COMPONENT REMAINS UNCHANGED */}
      <Drawer anchor={isMobile ? "bottom" : "right"} open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", md: 500 }, height: { xs: "85vh", md: "100%" }, bgcolor: theme.palette.background.paper, borderRadius: { xs: "20px 20px 0 0", md: 0 } } }}>
        {viewOrder && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 3, bgcolor: theme.palette.background.paper, borderBottom: 1, borderColor: "divider" }}>
              {isMobile && <Box sx={{ width: 40, height: 5, bgcolor: "#e2e8f0", borderRadius: 10, mx: "auto", mb: 3 }} />}
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Chip label={viewOrder.orderStatus} color={STATUS_STEPS[viewOrder.orderStatus]?.color || "default"} size="small" />
                <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ bgcolor: "#f1f5f9" }}><Close /></IconButton>
              </Stack>
              <Typography variant="h5" fontWeight={800}>#{viewOrder.orderNumber}</Typography>
              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                <Typography variant="body2" color={theme.palette.text.secondary} display="flex" alignItems="center" gap={0.5}>
                  <CreditCard sx={{ fontSize: 16 }} /> {viewOrder.paymentMethod || "Prepaid"}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
              <Paper sx={{ p: 2, mb: 4, borderRadius: 3, border: "1px solid #e2e8f0" }} elevation={0}>
                <Typography variant="subtitle2" gutterBottom fontWeight={700} color="text.secondary">CHANGE STATUS</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
                  <FormControl fullWidth size="small">
                    <Select
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value)}
                      sx={{ bgcolor: "#fff" }}
                    >
                      {Object.keys(STATUS_STEPS)
                        .filter(key => {
                          if (!RETURN_FLOW.includes(viewOrder.orderStatus) && key.startsWith("RETURN")) return false;
                          return true;
                        })
                        .map((key) => (<MenuItem key={key} value={key}>{STATUS_STEPS[key].label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" disabled={isUpdating || pendingStatus === viewOrder.orderStatus} onClick={handleSaveStatus} startIcon={!isUpdating && <Save />} fullWidth={isMobile} sx={{ minWidth: 110, height: 40, fontWeight: 700 }}>
                    {isUpdating ? <CircularProgress size={20} color="inherit" /> : "Update"}
                  </Button>
                </Stack>
              </Paper>

              {viewOrder.orderStatus === "RETURN_REQUESTED" && (
                <Stack spacing={2} mt={2} mb={4}>
                  <Button variant="contained" color="info" fullWidth onClick={async () => {
                      setIsUpdating(true);
                      try {
                        await orderApi.updateOrderStatus(viewOrder.id, "RETURN_APPROVED");
                        setViewOrder(prev => ({ ...prev, orderStatus: "RETURN_APPROVED" }));
                        setNotification({ open: true, message: "Return Approved", severity: "success" });
                        fetchOrders();
                      } catch (err) {
                        setNotification({ open: true, message: "Failed to approve", severity: "error" });
                      } finally { setIsUpdating(false); }
                    }}>Approve Return</Button>
                  <Button variant="outlined" color="error" fullWidth onClick={async () => {
                      setIsUpdating(true);
                      try {
                        await orderApi.updateOrderStatus(viewOrder.id, "CANCELLED");
                        setViewOrder(prev => ({ ...prev, orderStatus: "CANCELLED" }));
                        setNotification({ open: true, message: "Return Cancelled", severity: "error" });
                        fetchOrders();
                      } catch (err) {
                        setNotification({ open: true, message: "Failed to cancel", severity: "error" });
                      } finally { setIsUpdating(false); }
                    }}>Cancel Return</Button>
                </Stack>
              )}

              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>ITEMS IN ORDER</Typography>
              <Stack spacing={2}>
                {viewOrder.items.map((i, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>{i.name}</Typography>
                      <Typography variant="body2" color={theme.palette.text.secondary}>₹{i.price.toLocaleString()} x {i.quantity}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              <Typography variant="h6" fontWeight={700} mt={3}>Total: ₹{viewOrder.totalPrice.toLocaleString()}</Typography>
            </Box>
          </Box>
        )}
      </Drawer>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
        <Alert severity={notification.severity} sx={{ width: '100%' }}>{notification.message}</Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminOrdersDashboard;