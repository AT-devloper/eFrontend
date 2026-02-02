import React, { useState } from "react";
import { Box, Typography, Button, MobileStepper } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const slides = [
  {
    title: "Wedding Jewellery",
    subtitle: "Crafted for your most sacred moments",
    img: "https://images.unsplash.com/photo-1575730216745-1d4f905bc2d2",
    link: "/products",
  },
  {
    title: "Bridal Collections",
    subtitle: "Inspired by tradition & elegance",
    img: "https://images.unsplash.com/photo-1613981239658-0ff7f2b3d1f1",
    link: "/products",
  },
  {
    title: "Festive Gold",
    subtitle: "Celebrate every sparkle",
    img: "",
    link: "/products",
  },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = slides.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <Navbar />

      {/* Full-Screen Hero Carousel */}
      <Box sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <AutoPlaySwipeableViews
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{ height: "100%" }}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                height: "100vh",          // Full viewport height
                width: "100vw",           // Full viewport width
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#5E3B3B",         // Faded burgundy text
                background: `linear-gradient(
                  rgba(250, 244, 237, 0.5), 
                  rgba(222, 190, 150, 0.5) 70%
                ), url(${slide.img}) center/cover no-repeat`,
                px: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "1px 1px 6px rgba(0,0,0,0.15)",
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 400,
                  color: "rgba(94, 59, 59, 0.85)",
                }}
              >
                {slide.subtitle}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                href={slide.link}
                sx={{
                  background: "linear-gradient(135deg, #D8B67B, #E6CFA0)",
                  color: "#5E3B3B",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    opacity: 0.95,
                    transform: "translateY(-2px)",
                    background: "linear-gradient(135deg, #E6CFA0, #D8B67B)",
                  },
                }}
              >
                Explore Collections
              </Button>
            </Box>
          ))}
        </AutoPlaySwipeableViews>

        {/* Step Indicator */}
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            background: "transparent",
            justifyContent: "center",
            mt: -8,
            "& .MuiMobileStepper-dot": {
              backgroundColor: "rgba(94, 59, 59, 0.3)",
            },
            "& .MuiMobileStepper-dotActive": {
              backgroundColor: "#D8B67B",
            },
          }}
        />
      </Box>

      <Footer />
    </>
  );
}
