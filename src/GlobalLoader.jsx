import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const GlobalLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    // 500ms - The fastest professional duration for luxury sites
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              position: "fixed",
              top: 0, left: 0, width: "100vw", height: "100vh",
              zIndex: 99999,
              display: "flex", justifyContent: "center", alignItems: "center",
              background: "rgba(0, 0, 0, 0.4)", // Faded Black
              backdropFilter: "blur(10px)", // Partial Blur
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              {/* ANIMATED LOGO - FAST POP */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    letterSpacing: { xs: 8, md: 16 },
                    // LIQUID GOLD SHIMMER
                    background: "linear-gradient(90deg, #8A6E2F, #D4AF37, #FFF1A8, #D4AF37, #8A6E2F)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.4))",
                  }}
                  component={motion.h2}
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  ATLUXE
                </Typography>
              </motion.div>

              {/* FAST UNDERLINE */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  height: "1px",
                  background: "#D4AF37",
                  marginTop: "8px",
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Instant focus */}
      <Box sx={{ 
        opacity: isLoading ? 0.3 : 1, 
        filter: isLoading ? "blur(5px)" : "blur(0px)",
        transition: "all 0.4s ease-in-out" 
      }}>
        {children}
      </Box>
    </>
  );
};

export default GlobalLoader;