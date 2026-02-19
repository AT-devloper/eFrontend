import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Paper,
  FormControl,
  InputLabel,
  Chip
} from "@mui/material";
import { LocalShipping, CheckCircle, Save } from "@mui/icons-material";
import { motion } from "framer-motion";
import orderApi from "../api/orderApi";

const ORDER_STATUSES = [
  "ORDERED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const OrderStatusUpdate = ({ orderId, currentStatus, onStatusUpdated }) => {
  const theme = useTheme();
  const [status, setStatus] = useState(currentStatus || "ORDERED");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError("");
      await orderApi.updateOrderStatus(orderId, status);
      setSuccess(true);
      if (onStatusUpdated) onStatusUpdated(status);
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.secondary.light}`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Gold Bar */}
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", bgcolor: theme.palette.secondary.main }} />

      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <LocalShipping sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.primary.main }}>
          Update Order Status
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <FormControl fullWidth size="medium">
          <InputLabel sx={{ color: theme.palette.text.secondary }}>Select New Status</InputLabel>
          <Select
            value={status}
            label="Select New Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.secondary.main },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.secondary.main },
            }}
          >
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ py: 1.5 }}>
                 <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                    <Typography variant="body2">{s.replaceAll("_", " ")}</Typography>
                    {s === currentStatus && <Chip label="Current" size="small" color="secondary" sx={{ height: 20, fontSize: "0.6rem" }} />}
                 </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            disabled={loading || status === currentStatus}
            startIcon={!loading && <Save />}
            sx={{
              py: 1.5,
              borderRadius: 20,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              fontWeight: "bold",
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
          </Button>
        </motion.div>
      </Stack>

      {/* Notifications */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.main }}>
          Status Updated Successfully
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default OrderStatusUpdate;