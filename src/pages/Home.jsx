import React, { useState } from "react";
import { Box, Typography, Button, MobileStepper } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const slides = [
  {
    title: "Wedding Jewellery",
    subtitle: "Crafted for your most sacred moments",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070",
    link: "/products",
  },
  {
    title: "Bridal Collections",
    subtitle: "Inspired by tradition & elegance",
    img: "https://images.unsplash.com/photo-1613981239658-0ff7f2b3d1f1?q=80&w=2070",
    link: "/products",
  },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Navbar />

      <Box sx={{ position: "relative", height: "100vh", width: "100vw" }}>
        <AutoPlaySwipeableViews
          index={activeStep}
          onChangeIndex={(s) => setActiveStep(s)}
          enableMouseEvents
          interval={6000} // Slower for a premium feel
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.img}) center/cover no-repeat`,
                px: 3,
              }}
            >
              {/* Animated Text Container */}
              <AnimatePresence mode="wait">
                {activeStep === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ textAlign: "center" }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#fff",
                        fontSize: { xs: "3rem", md: "5rem" },
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "rgba(255,255,255,0.9)", mb: 4, letterSpacing: 2 }}
                    >
                      {slide.subtitle}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "secondary.main",
                        color: "primary.main",
                        px: 6,
                        py: 2,
                        borderRadius: 0, // Sharp edges feel more "Vogue"
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        letterSpacing: 2,
                        "&:hover": { bgcolor: "#fff" },
                      }}
                    >
                      DISCOVER MORE
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          ))}
        </AutoPlaySwipeableViews>

        {/* Floating Scroll Indicator */}
        <Box
          component={motion.div}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            opacity: 0.6,
          }}
        >
          <Typography variant="caption" sx={{ letterSpacing: 3 }}>SCROLL</Typography>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}