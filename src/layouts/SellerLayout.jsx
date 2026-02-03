import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Box } from "@mui/material";

/**
 * Optimized Layout
 * 1. Uses Material UI Box for consistent spacing with the Product Page.
 * 2. Implements a CSS-only "Sticky Footer" pattern.
 * 3. Ensures the main content has a stable min-height to prevent jumping during loads.
 */
export default function SellerLayout({ children }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#fff' // Clean white background for luxury feel
      }}
    >
      {/* If your Navbar is 'fixed', this Box ensures content 
         starts exactly below it without using "mt-5" hacks.
      */}
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          // Adjust 64px based on your actual Navbar height
          pt: { xs: '56px', sm: '64px' }, 
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}