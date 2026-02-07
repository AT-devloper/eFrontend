import React from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  InputAdornment,
  Fade
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import DescriptionIcon from '@mui/icons-material/Description';

const ProductInfoStep = ({ state, dispatch }) => {
  
  // Custom styles to match your softDarkTheme
  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "background.paper",
      "& fieldset": {
        borderColor: "rgba(74, 46, 46, 0.2)", // Subtle Burgundy
      },
      "&:hover fieldset": {
        borderColor: "primary.light",
      },
      "&.Mui-focused fieldset": {
        borderColor: "secondary.main", // Gold
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "primary.main",
      "&.Mui-focused": {
        color: "secondary.dark",
      },
    },
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Product Details
        </Typography>

        <Grid container spacing={4}>
          {/* Product Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              placeholder="e.g. Vintage Diamond Engagement Ring"
              // Keep your logic: fallback to "" to prevent uncontrolled input errors
              value={state.productInfo?.name || ""}
              onChange={(e) =>
                dispatch({
                  productInfo: { ...state.productInfo, name: e.target.value },
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreateIcon sx={{ color: "secondary.main" }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyles}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              placeholder="Describe the craftsmanship, metal purity, and stone details..."
              value={state.productInfo?.description || ""}
              onChange={(e) =>
                dispatch({
                  productInfo: { ...state.productInfo, description: e.target.value },
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <DescriptionIcon sx={{ color: "secondary.main" }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyles}
            />
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          sx={{ mt: 3, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}
        >
          Your details are automatically saved as you type.
        </Typography>
      </Box>
    </Fade>
  );
};

export default ProductInfoStep;