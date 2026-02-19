import React, { useState } from "react";
import { 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  useTheme, 
  Fade 
} from "@mui/material";
import { 
  Download as DownloadIcon, 
  Description as FileIcon 
} from "@mui/icons-material";
import axios from "axios";

const BASE_URL = "http://localhost:8080/auth/orders";

const DownloadInvoiceButton = ({ orderId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "info" 
  });

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User session expired. Please login again.");

      const res = await axios.get(`${BASE_URL}/${orderId}/invoice`, {
        responseType: "blob", // Important for files
        headers: { Authorization: `Bearer ${token}` },
      });

      // PROFESSIONAL TOUCH: Check if the blob is actually a JSON error
      // Sometimes servers return JSON errors (400/500) even with responseType='blob'
      if (res.data.type === "application/json") {
        const errorText = await res.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Could not generate invoice.");
      }

      if (!res.data || res.data.size === 0) {
        throw new Error("Invoice file is empty.");
      }

      // Create download link
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_Order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      setNotification({ 
        open: true, 
        message: "Invoice downloaded successfully.", 
        severity: "success" 
      });

    } catch (err) {
      console.error("Invoice download failed:", err);
      setNotification({ 
        open: true, 
        message: err.message || "Failed to download. Please try again.", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDownloadInvoice}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" thickness={5} />
          ) : (
            <DownloadIcon />
          )
        }
        sx={{
          textTransform: "none", // Modern UI uses Sentence case, not ALL CAPS
          fontWeight: 600,
          borderRadius: "12px", // Slightly rounded but professional
          padding: "8px 20px",
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            transform: "translateY(-1px)", // Subtle lift effect
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: "none",
          },
          // Ensure button doesn't shrink when showing spinner
          minWidth: "160px", 
        }}
      >
        {loading ? "Processing..." : "Invoice"}
      </Button>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Standard location
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled" // "filled" pops more for notifications
          sx={{ width: "100%", fontWeight: 500, boxShadow: 3 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DownloadInvoiceButton;