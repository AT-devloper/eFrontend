import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  Zoom 
} from "@mui/material";
import { motion } from "framer-motion";

// Helper for icons (Optional: You can use actual jewelry icons here)
import DiamondIcon from '@mui/icons-material/Diamond';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const CategoryStep = ({ state, dispatch }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Simulated fetch
    setCategories([
      { id: 1, name: "Rings", icon: <DiamondIcon /> },
      { id: 2, name: "Necklaces", icon: <AutoAwesomeIcon /> },
      { id: 3, name: "Bracelets", icon: <DiamondIcon /> },
      { id: 4, name: "Earrings", icon: <AutoAwesomeIcon /> },
    ]);
  }, []);

  const handleSelect = (id) => {
    dispatch({ categoryId: id });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Select a Category
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {categories.map((cat, index) => (
          <Grid item xs={6} sm={3} key={cat.id}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  sx={{
                    border: state.categoryId === cat.id 
                      ? `2px solid #D8B67B` // Highlight with your Gold secondary
                      : "2px solid transparent",
                    boxShadow: state.categoryId === cat.id 
                      ? "0 12px 24px rgba(216,182,123,0.3)" 
                      : "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleSelect(cat.id)}
                    sx={{ height: '100%', textAlign: 'center', p: 2 }}
                  >
                    <CardContent>
                      <Box sx={{ 
                        color: state.categoryId === cat.id ? "secondary.main" : "primary.main",
                        mb: 1,
                        fontSize: '2rem'
                      }}>
                        {cat.icon}
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: state.categoryId === cat.id ? 700 : 500,
                          color: state.categoryId === cat.id ? "secondary.dark" : "text.primary"
                        }}
                      >
                        {cat.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {state.categoryId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mt: 4, color: "secondary.dark", fontStyle: 'italic' }}
          >
            You have selected the perfect {categories.find(c => c.id === state.categoryId)?.name}.
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default CategoryStep;