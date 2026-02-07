import React from "react";
import { 
  Box, Typography, TextField, Paper, InputAdornment 
} from "@mui/material";
import FactoryIcon from '@mui/icons-material/Factory';
import InfoIcon from '@mui/icons-material/Info';

const ProductManufact = ({ state, dispatch }) => {
  
  // Handing change to sync with the "content" body your Spring controller expects
  const handleContentChange = (value) => {
    dispatch({ manufacturer: value });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center', gap: 1 }}>
        <FactoryIcon /> From the Manufacturer
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Share the craftsmanship story, origin, or brand heritage of this piece.
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          bgcolor: "#FDFCFB", 
          border: "1px solid #eee" 
        }}
      >
        <TextField
          fullWidth
          label="Manufacturer Details & Brand Story"
          placeholder="e.g., Handcrafted in Jaipur using traditional Meenakari techniques. Our brand has been creating ethical jewelry since 1985..."
          multiline
          rows={8}
          value={state.manufacturer || ""}
          onChange={(e) => handleContentChange(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <InfoIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            }
          }}
        />
        
        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
          * This content will appear in the "From the Manufacturer" section on the product page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProductManufact;