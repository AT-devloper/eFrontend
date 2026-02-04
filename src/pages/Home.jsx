import React, { useState } from "react";
import { Box, Typography, Button, Grid, Container, Stack } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// 1. REVEAL WRAPPER
const ScrollReveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const heroSlides = [
  {
    title: "The 22K Gold Archive",
    subtitle: "Untouched by stones. Defined by purity.",
    img: "https://images.unsplash.com/photo-1610492497676-e1e309395995?q=80&w=2000",
  },
  {
    title: "Nakkashi Masterpieces",
    subtitle: "Divine carvings etched in solid sovereign gold",
    img: "https://images.unsplash.com/photo-1629227353400-e793910609b5?q=80&w=2000",
  },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <Box sx={{ position: "relative", height: "100vh", width: "100vw" }}>
        <AutoPlaySwipeableViews index={activeStep} onChangeIndex={setActiveStep} interval={7000}>
          {heroSlides.map((slide, index) => (
            <Box key={index} sx={{ 
              height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${slide.img}) center/cover no-repeat`,
            }}>
              <AnimatePresence mode="wait">
                {activeStep === index && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1.2 }}
                    style={{ textAlign: "center" }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: 6, color: "#D4AF37", fontWeight: 700 }}>
                      THE STANDARD OF PURITY
                    </Typography>
                    <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: { xs: "3rem", md: "6rem" }, fontWeight: 400, my: 2 }}>
                      {slide.title}
                    </Typography>
                    <Button variant="contained" sx={{ bgcolor: "#D4AF37", color: "#000", px: 6, py: 2, borderRadius: 0, fontWeight: 900, "&:hover": { bgcolor: "#fff" } }}>
                      SHOP THE GOLD ARCHIVE
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          ))}
        </AutoPlaySwipeableViews>
      </Box>

      {/* --- PURE GOLD PHILOSOPHY --- */}
      <Container maxWidth="md" sx={{ py: 15, textAlign: "center" }}>
        <ScrollReveal>
          <Typography variant="overline" sx={{ color: "#D4AF37", letterSpacing: 4, fontWeight: 700 }}>NO GEMS. NO DIAMONDS.</Typography>
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", my: 3 }}>The Soul of 22 Karats</Typography>
          <Typography variant="body1" sx={{ color: "#555", lineHeight: 2.2, fontSize: "1.15rem", fontStyle: "italic" }}>
            "We believe gold doesn't need diamonds to shine. At AT-LUXE, we focus on the raw, molten beauty of pure yellow gold, hand-beaten and polished by master smiths whose lineage dates back to the Royal Courts."
          </Typography>
        </ScrollReveal>
      </Container>

      {/* --- GOLD TEXTURE GRID --- */}
      <Container maxWidth="xl" sx={{ pb: 15 }}>
        <Grid container spacing={3}>
          {[
            { name: "Solid Kadas", img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800", size: 7 },
            { name: "Gold Coins", img: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800", size: 5 },
            { name: "Temple Necklaces", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800", size: 12 },
          ].map((item, i) => (
            <Grid item xs={12} md={item.size} key={i}>
              <ScrollReveal>
                <Box sx={{ 
                  height: "500px", position: "relative", overflow: "hidden", 
                  "&:hover img": { transform: "scale(1.05)" } 
                }}>
                  <Box component="img" src={item.img} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "2s ease" }} />
                  <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 4, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", width: "100%" }}>
                    <Typography variant="h4" sx={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}>{item.name}</Typography>
                  </Box>
                </Box>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- GOLD PRICE SECTION (STILL DATA) --- */}
      <Box sx={{ bgcolor: "#fdf8ef", py: 10 }}>
        <Container maxWidth="lg">
            <ScrollReveal>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={4}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>TODAY'S GOLD STANDARD</Typography>
                        <Typography variant="caption" sx={{ color: "#888" }}>Updated Feb 2026</Typography>
                    </Box>
                    <Stack direction="row" spacing={8}>
                        <Box textAlign="center">
                            <Typography variant="h4" sx={{ color: "#D4AF37", fontWeight: 700 }}>₹7,450</Typography>
                            <Typography variant="caption">22K / Per Gram</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h4" sx={{ color: "#D4AF37", fontWeight: 700 }}>₹8,120</Typography>
                            <Typography variant="caption">24K / Per Gram</Typography>
                        </Box>
                    </Stack>
                    <Button variant="outlined" sx={{ borderColor: "#000", color: "#000", borderRadius: 0, px: 4 }}>CHECK PRICE TRENDS</Button>
                </Stack>
            </ScrollReveal>
        </Container>
      </Box>

      <Footer />
    </motion.div>
  );
}