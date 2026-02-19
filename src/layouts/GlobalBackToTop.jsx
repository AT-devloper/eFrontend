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
            bottom: 40,
            right: 40,
            zIndex: 9999,
          }}
        >
          <Fab
            onClick={scrollToTop}
            aria-label="scroll back to top"
            sx={{
              width: 60,
              height: 60,
              bgcolor: theme.palette.secondary.main, // Gold
              color: theme.palette.primary.main,    // Burgundy Icon
              boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
              border: `1px solid ${theme.palette.secondary.light}`,
              "&:hover": {
                bgcolor: theme.palette.secondary.light, // Lighter Gold
                transform: "translateY(-5px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: "2rem" }} />
          </Fab>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default GlobalBackToTop;