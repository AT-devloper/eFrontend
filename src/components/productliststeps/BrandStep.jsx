import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  Avatar, 
  Skeleton, 
  Fade 
} from "@mui/material";
import { motion } from "framer-motion";
import sellerApi from "../../api/sellerApi";

const BrandStep = ({ state, dispatch }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await sellerApi.getAllBrands();
        setBrands(response.data || response);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleSelect = (id) => {
    dispatch({ brandId: id });
  };

  // Luxury Skeleton Loader
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 4 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 5 }}>
        Choose a Brand
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {brands.map((brand, index) => {
          const isSelected = state.brandId === brand.id;
          
          return (
            <Grid item xs={6} sm={4} md={2.4} key={brand.id}>
              <Fade in timeout={500 + index * 100}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      backgroundColor: isSelected ? "primary.main" : "background.paper",
                      border: `2px solid ${isSelected ? "#D8B67B" : "transparent"}`,
                      transition: "all 0.3s ease",
                      boxShadow: isSelected ? "0 8px 20px rgba(74, 46, 46, 0.2)" : 1,
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleSelect(brand.id)}
                      sx={{ p: 2, textAlign: 'center' }}
                    >
                      <Avatar
                        src={brand.logo_url}
                        alt={brand.name}
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          mx: "auto",
                          mb: 1.5,
                          bgcolor: "white", // High contrast for logos
                          p: 0.5,
                          boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)"
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: isSelected ? "secondary.main" : "text.primary",
                        }}
                      >
                        {brand.name}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Fade>
            </Grid>
          );
        })}
      </Grid>

      {state.brandId && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 1 }}>
            CURATED COLLECTION FROM
          </Typography>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            {brands.find((b) => b.id === state.brandId)?.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BrandStep;