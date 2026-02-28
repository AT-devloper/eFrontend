import React, { useState, useEffect } from "react";
import { Box, Fab, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from "framer-motion";

const GlobalBackToTop = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Show slightly earlier on mobile since scrolling happens faster
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          sx={{
            position: "fixed",
            // Tucked closer to the edge on mobile (20px), standard distance on desktop (40px)
            bottom: { xs: 20, md: 40 },
            right: { xs: 20, md: 40 },
            zIndex: 9999,
          }}
        >
          <Fab
            onClick={scrollToTop}
            aria-label="scroll back to top"
            sx={{
              // Smaller button footprint on mobile
              width: { xs: 45, md: 60 },
              height: { xs: 45, md: 60 },
              // Ensures the icon stays perfectly centered when button shrinks
              minHeight: { xs: 45, md: 60 }, 
              bgcolor: theme.palette.secondary.main, // Gold
              color: theme.palette.primary.main,    // Burgundy Icon
              boxShadow: { 
                xs: "0px 5px 15px rgba(0,0,0,0.3)", // Softer shadow on mobile
                md: "0px 10px 20px rgba(0,0,0,0.3)" 
              },
              border: `1px solid ${theme.palette.secondary.light}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: theme.palette.secondary.light, // Lighter Gold
                transform: "translateY(-5px)",
              },
            }}
          >
            {/* Slightly smaller icon to match the smaller mobile button */}
            <KeyboardArrowUpIcon sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }} />
          </Fab>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default GlobalBackToTop;