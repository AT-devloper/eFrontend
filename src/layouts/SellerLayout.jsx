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
      display="flex"
      flexDirection="column"
      minHeight="100vh" // ensures the layout fills the viewport
    >
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content grows to fill space */}
      <Box
        component="main"
        flexGrow={1} // takes all available vertical space
        p={2} // optional padding
        bgcolor="#f9f9f9" // optional background for main content
      >
        {children}
      </Box>

      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
}
