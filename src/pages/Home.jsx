import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Grid, Container, Stack, useTheme, useMediaQuery, IconButton
} from "@mui/material";
import { 
  motion, useScroll, useTransform, useSpring, useInView 
} from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// --- VERIFIED HIGH-RES ASSETS ---
const IMAGES = {
  // Hero: A moody, high-fashion shot of gold jewelry
  hero: "https://images.unsplash.com/photo-1629227353400-e793910609b5?q=80&w=2000&auto=format&fit=crop", 
  // Editorial: A woman wearing traditional jewelry
  model: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1286&auto=format&fit=crop", 
  // Parallax 1: Close up ring
  ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop", 
  // Parallax 2: Craftsmanship detail
  craft: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop", 
  // Collection 1: Bridal
  bridal: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=800&auto=format&fit=crop",
  // Collection 2: Daily
  daily: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  // Collection 3: Coins
  coins: "https://images.unsplash.com/photo-1639815188546-c43c240ff4df?q=80&w=800&auto=format&fit=crop"
};

// --- ANIMATION COMPONENTS ---

// 1. RevealText: Text slides up from an invisible box
const RevealText = ({ children, delay = 0, variant = "h2", color }) => (
  <Box sx={{ overflow: "hidden" }}>
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }} // Bezier for "Luxury" feel
    >
      <Typography variant={variant} sx={{ color: color, fontFamily: "'Playfair Display', serif" }}>
        {children}
      </Typography>
    </motion.div>
  </Box>
);

// 2. Marquee: Infinite scrolling text strip
const Marquee = ({ text }) => {
  const theme = useTheme();
  return (
    <Box sx={{ 
      bgcolor: theme.palette.primary.main, 
      color: theme.palette.secondary.main,
      py: 2, overflow: "hidden", whiteSpace: "nowrap",
      borderTop: `1px solid ${theme.palette.secondary.dark}`,
      borderBottom: `1px solid ${theme.palette.secondary.dark}`
    }}>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        style={{ display: "flex", gap: "60px", alignItems: "center" }}
      >
        {[...Array(8)].map((_, i) => (
          <Typography key={i} variant="h6" sx={{ 
            fontFamily: "'Playfair Display', serif", 
            letterSpacing: 4, 
            textTransform: "uppercase",
            opacity: 0.9 
          }}>
            {text} <span style={{ opacity: 0.3, margin: '0 20px' }}>✦</span>
          </Typography>
        ))}
      </motion.div>
    </Box>
  );
};

// 3. ParallaxSection: Image moves slower than scroll
const ParallaxSection = ({ img }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <Box ref={ref} sx={{ height: "500px", overflow: "hidden", position: "relative", borderRadius: "4px" }}>
      <motion.div style={{ y, width: "100%", height: "130%", position: "absolute", top: "-15%" }}>
        <Box 
          component="img" 
          src={img} 
          sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </motion.div>
    </Box>
  );
};
const currentYear = new Date().getFullYear();
export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    // CRITICAL: overflowX: hidden prevents horizontal shaking
    <Box sx={{ overflowX: "hidden", width: "100%", bgcolor: theme.palette.background.default }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <Navbar />

        {/* --- HERO SECTION: SPLIT LAYOUT --- */}
        <Box sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          pt: { xs: "60px", md: 0 } 
        }}>
          {/* Left: Editorial Content (Burgundy Background) */}
          <Box sx={{ 
            flex: 1, 
            bgcolor: theme.palette.primary.main, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            px: { xs: 4, md: 10 },
            py: { xs: 8, md: 0 },
            position: "relative",
            zIndex: 2
          }}>
            {/* Animated Gold Line */}
            <motion.div 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: 1 }} 
              transition={{ duration: 1, delay: 0.5 }}
              style={{ 
                width: "120px", 
                height: "2px", 
                backgroundColor: theme.palette.secondary.main, 
                marginBottom: "2rem",
                transformOrigin: "left" 
              }} 
            />
            
            <RevealText variant="overline" color={theme.palette.secondary.light}>
              © {currentYear}  AT-LUXE • ESTABLISHED IN INDIA
            </RevealText>

            <Box sx={{ mt: 2, mb: 4 }}>
               <RevealText variant="h1" color="#F5EDE5">
                 Timeless
               </RevealText>
               <RevealText variant="h1" color={theme.palette.secondary.main}>
                 Opulence
               </RevealText>
            </Box>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}>
              <Typography variant="body1" sx={{ color: theme.palette.secondary.light, maxWidth: "400px", mb: 6, lineHeight: 1.8, fontSize: "1.1rem" }}>
                Discover the lost art of royal jewelry making. Hand-forged 22K gold, designed for those who wear history.
              </Typography>

              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/products')}
                sx={{ 
                  borderRadius: 0, 
                  px: 5, py: 1.5, 
                  fontSize: "1rem",
                  letterSpacing: 2,
                  boxShadow: "none"
                }}
              >
                Explore Collection
              </Button>
            </motion.div>
          </Box>

          {/* Right: Immersive Image */}
          <Box sx={{ flex: 1, position: "relative", height: { xs: "50vh", md: "100vh" }, overflow: "hidden" }}>
            <motion.div 
               initial={{ scale: 1.2, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               transition={{ duration: 2, ease: "easeOut" }}
               style={{ width: "100%", height: "100%" }}
            >
              <Box 
                component="img" 
                src={IMAGES.model} 
                sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              {/* Gradient Overlay for blending */}
              <Box sx={{ 
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                background: `linear-gradient(to right, ${theme.palette.primary.main} 0%, transparent 40%)`,
                display: { xs: "none", md: "block" }
              }} />
            </motion.div>
          </Box>
        </Box>

        <Marquee text="Heritage • Purity • Craftsmanship • Royalty • AT-LUXE •" />

        {/* --- EDITORIAL GRID SECTION --- */}
        <Container maxWidth="xl" sx={{ py: 15 }}>
          <Grid container spacing={8}>
            {/* Text Column */}
            <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <RevealText variant="h2" color={theme.palette.text.primary}>
                The Soul of
              </RevealText>
              <RevealText variant="h2" color={theme.palette.primary.main}>
                 Substance.
              </RevealText>
              
              <Typography variant="body1" sx={{ mt: 4, mb: 4, fontSize: "1.2rem", lineHeight: 2, color: theme.palette.text.secondary }}>
                "We believe true luxury lies in weight, not just shine. Our pieces are crafted with the density of history, using techniques preserved by families for generations of AT-LUXE."
              </Typography>

              <Stack direction="row" spacing={6}>
                 <Box>
                   <Typography variant="h3" color="primary">22K</Typography>
                   <Typography variant="caption" sx={{ letterSpacing: 2 }}>SOLID GOLD</Typography>
                 </Box>
                 <Box>
                   <Typography variant="h3" color="primary">100%</Typography>
                   <Typography variant="caption" sx={{ letterSpacing: 2 }}>HALLMARKED</Typography>
                 </Box>
              </Stack>
            </Grid>

            {/* Parallax Images Column */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                   <ParallaxSection img={IMAGES.ring} />
                   <Typography variant="overline" sx={{ display: "block", mt: 2, letterSpacing: 3, fontWeight: 700 }}>The Signet Ring</Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ mt: { xs: 0, md: 10 } }}>
                   <ParallaxSection img={IMAGES.craft} />
                   <Typography variant="overline" sx={{ display: "block", mt: 2, letterSpacing: 3, fontWeight: 700 }}>Temple Necklaces</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* --- DARK IMMERSIVE "ATELIER" SECTION --- */}
        <Box sx={{ 
          bgcolor: theme.palette.primary.dark, 
          color: "#fff", 
          py: 20, 
          position: "relative",
          overflow: "hidden"
        }}>
           <Container maxWidth="lg" sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 0.8 }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 8, color: theme.palette.secondary.main }}>
                  THE ATELIER
                </Typography>
                <Typography variant="h1" sx={{ 
                  my: 4, 
                  fontSize: { xs: "3rem", md: "7rem" },
                  background: `linear-gradient(to right, #fff, ${theme.palette.secondary.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Forged in Fire
                </Typography>

            <Typography variant="overline" sx={{ letterSpacing: 8, color: theme.palette.secondary.main }}>
                  AT-LUXE
                </Typography>
                              
              </motion.div>
           </Container>

           {/* Abstract Background Decoration */}
           <Box sx={{ 
             position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
             width: "60vw", height: "60vw",
             background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
             opacity: 0.15,
             zIndex: 1
           }} />
        </Box>

        {/* --- CURATED COLLECTIONS --- */}
        <Container maxWidth="xl" sx={{ py: 15 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 8, 
              textAlign: "center", 
              fontFamily: "'Playfair Display', serif",
              color: theme.palette.primary.main
            }}
          >
            Curated Collections
          </Typography>
          
          <Grid container spacing={4}>
            {[
              { 
                title: "Bridal Heritage", 
                img: IMAGES.bridal,
                link: "Bridal"
              },
              { 
                title: "Daily Elegance", 
                img: IMAGES.daily,
                link: "Daily"
              },
              { 
                title: "Gold Coins", 
                img: IMAGES.coins,
                link: "Coins"
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div 
                  whileHover={{ y: -10 }} 
                  transition={{ duration: 0.4 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/products?category=${item.link}`)}
                >
                  <Box 
                    sx={{ 
                      position: "relative", 
                      height: "600px", // Tall, elegant cards
                      overflow: "hidden",
                      borderRadius: "2px",
                      "&:hover img": { transform: "scale(1.1)" },
                      "&:hover .overlay": { opacity: 0.3 },
                    }}
                  >
                    <Box 
                      component="img" 
                      src={item.img} 
                      alt={item.title}
                      sx={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        transition: "transform 0.8s ease" 
                      }} 
                    />
                    
                    {/* Dark Overlay using Theme Primary */}
                    <Box 
                      className="overlay" 
                      sx={{ 
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        bgcolor: theme.palette.primary.dark,
                        opacity: 0.1, // Slight tint by default
                        transition: "0.5s ease"
                      }} 
                    />

                    {/* Centered Title */}
                    <Box sx={{ 
                      position: "absolute", 
                      top: "50%", 
                      left: "50%", 
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      width: "100%",
                      zIndex: 2,
                      px: 2
                    }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          color: "#fff", 
                          fontFamily: "'Playfair Display', serif",
                          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          mb: 1
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="button" 
                        sx={{ 
                          color: theme.palette.secondary.main, 
                          letterSpacing: 2,
                          borderBottom: `1px solid ${theme.palette.secondary.main}`,
                          pb: 0.5
                        }}
                      >
                        SHOP NOW
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Footer />
      </motion.div>
    </Box>
  );
}