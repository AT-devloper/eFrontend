import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom"; 

// 8 Luxury Categories
const luxuryWords = [
  "GOLD", "JEWELLERY", "RINGS", "NECKLACES", "BRACELETS", "BANGLES", "CHAINS", "EARRINGS"
];

const GlobalLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const location = useLocation(); 

  useEffect(() => {
    setIsLoading(true);
    setWordIndex(0);

    // 1. FASTER: Total time reduced to exactly 1.2s (1200ms)
    const timer = setTimeout(() => setIsLoading(false), 1200);

    // 2. FASTER: Word switches every 150ms (8 * 150 = 1200ms)
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % luxuryWords.length);
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(wordInterval);
    };
  }, [location.pathname]); 

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // FASTER EXIT (0.4s down from 0.6s)
            exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
            style={{
              position: "fixed",
              top: 0, left: 0, width: "100vw", height: "100vh",
              zIndex: 99999,
              display: "flex", justifyContent: "center", alignItems: "center",
              background: "radial-gradient(circle, rgba(74, 46, 46, 0.45) 0%, rgba(15, 8, 8, 0.85) 100%)",
              backdropFilter: "blur(16px)", 
              WebkitBackdropFilter: "blur(16px)",
              willChange: "opacity, filter",
            }}
          >
            <Box sx={{ textAlign: "center", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              
              {/* SOFT GLOW AURA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }} // Sped up
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "220px", height: "90px",
                    background: "radial-gradient(ellipse, rgba(216, 182, 123, 0.15) 0%, transparent 70%)",
                    zIndex: -1,
                    pointerEvents: "none",
                    willChange: "transform, opacity"
                }}
              />

              {/* 1. BRAND LOGO */}
              <motion.div
                initial={{ y: 15, scale: 0.95, opacity: 0, letterSpacing: "8px" }}
                animate={{ y: 0, scale: 1, opacity: 1, letterSpacing: "16px" }}
                transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }} // Sped up
                style={{ willChange: "transform, opacity" }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    ml: "16px", 
                    background: "linear-gradient(to right, #B38728, #FDF7D2, #D8B67B, #FDF7D2, #B38728)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0px 4px 12px rgba(216, 182, 123, 0.25))",
                    lineHeight: 1,
                  }}
                  component={motion.h2}
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ATLUXE
                </Typography>
              </motion.div>

              {/* 2. PROGRESS BAR TRACK */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }} // Sped up delay
                style={{
                  width: "200px", 
                  height: "2px",
                  background: "rgba(255, 255, 255, 0.1)", 
                  marginTop: "20px",
                  borderRadius: "50px",
                  overflow: "hidden",
                  position: "relative",
                  willChange: "opacity"
                }}
              >
                {/* 3. PROGRESS BAR FILL */}
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  // FASTER FILL: 1.0s duration + 0.1s delay = 1.1s total (finishes right before 1.2s timeout)
                  transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #B38728, #FDF7D2, #D8B67B)",
                    borderRadius: "50px",
                    boxShadow: "0px 0px 10px rgba(216, 182, 123, 0.8)",
                    willChange: "width"
                  }}
                />
              </motion.div>

              {/* 4. DEFINED TEXT CAROUSEL */}
              <Box sx={{ height: "30px", mt: 2.5, position: "relative", width: "100%" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={luxuryWords[wordIndex]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1, ease: "easeOut" }} // Extremely fast snap
                    style={{ position: "absolute", width: "100%", textAlign: "center", willChange: "transform, opacity" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem", 
                        fontWeight: 900, 
                        letterSpacing: "6px", 
                        color: "#FDF7D2", 
                        textTransform: "uppercase",
                        textShadow: "0px 2px 8px rgba(0,0,0,0.9), 0px 0px 2px rgba(0,0,0,1)", 
                        ml: "6px", 
                      }}
                    >
                      {luxuryWords[wordIndex]}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>

            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT REVEAL */}
      <Box sx={{ 
        opacity: isLoading ? 0 : 1, // FIXED: Opacity max is 1, not 2
        filter: isLoading ? "blur(10px)" : "blur(0px)",
        transform: isLoading ? "scale(0.95)" : "scale(1)",
        // FASTER REVEAL: 0.4s down from 0.6s
        transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        minHeight: "100vh",
        willChange: "opacity, filter, transform"
      }}>
        {children}
      </Box>
    </>
  );
};

export default GlobalLoader;