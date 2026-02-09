import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../components/layout/Navbar";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  IconButton,
  Paper,
  Skeleton,
  useTheme,
} from "@mui/material";
import { FaTrash, FaArrowRight } from "react-icons/fa";

const THEME_COLORS = {
  gold: "#C5A059",
  black: "#1a1a1a",
  bg: "#F8F8F8",
  text: "#333",
};

const Wishlist = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: THEME_COLORS.bg, minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6, px: { xs: 3, md: 8 } }}>
        {/* --- Header --- */}
        <Box
          mb={6}
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
          borderBottom={`1px solid ${THEME_COLORS.gold}`}
          pb={2}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                color: THEME_COLORS.black,
                letterSpacing: 1,
              }}
            >
              MY WISHLIST
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Curated favorites collection
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: THEME_COLORS.gold }}
          >
            {wishlist.length} {wishlist.length === 1 ? "ITEM" : "ITEMS"}
          </Typography>
        </Box>

        {/* --- Grid --- */}
        <Grid container spacing={4}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={320}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton width="70%" sx={{ mt: 2, mx: "auto" }} />
              </Grid>
            ))
          ) : wishlist.length > 0 ? (
            wishlist.map((item) => (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={item.productId}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/products/${item.productId}`)}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    border: "1px solid transparent",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                      borderColor: "rgba(197, 160, 89, 0.2)",
                    },
                    "&:hover .zoom-image": {
                      transform: "scale(1.12)",
                    },
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "3/4",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      className="zoom-image"
                      src={item.image || "/placeholder.png"}
                      alt={item.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    />

                    {/* ✅ ONLY FIX IS HERE */}
                    <IconButton
                      className="delete-btn"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.productId);// ✅ FIXED
                      }}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        opacity: 0,
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: THEME_COLORS.black,
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: THEME_COLORS.black,
                          color: "#fff",
                        },
                      }}
                    >
                      <FaTrash size={12} />
                    </IconButton>
                  </Box>

                  <Box sx={{ p: 2.5, textAlign: "center" }}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 800,
                        color: THEME_COLORS.black,
                        letterSpacing: 0.5,
                        mb: 1,
                      }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: THEME_COLORS.gold,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                      }}
                    >
                      View Piece
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" py={12}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#999",
                  mb: 3,
                }}
              >
                Your wishlist is currently empty.
              </Typography>
              <Button
                onClick={() => navigate("/products")}
                variant="contained"
                endIcon={<FaArrowRight size={12} />}
                sx={{
                  bgcolor: THEME_COLORS.black,
                  color: "white",
                  borderRadius: 0,
                  px: 5,
                  py: 1.5,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: 1,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: THEME_COLORS.gold,
                    boxShadow: "none",
                  },
                }}
              >
                START CURATING
              </Button>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Wishlist;
