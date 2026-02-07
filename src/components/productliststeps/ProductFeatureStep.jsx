import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Chip, Stack, TextField, Button, 
  Paper, Divider, Alert 
} from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ProductFeatureStep = ({ state, dispatch }) => {
  const [featureOptions, setFeatureOptions] = useState([
    "Handmade", "Hallmarked", "Certified", "Limited Edition", 
    "Adjustable", "Nickel Free", "Eco-Friendly", "Ethically Sourced"
  ]);
  const [customFeature, setCustomFeature] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Sync with global state on load
  useEffect(() => {
    if (state.features && state.features.length) {
      setSelectedFeatures(state.features.map((f) => f.feature));
    }
  }, [state.features]);

  const updateGlobalState = (updatedList) => {
    dispatch({
      features: updatedList.map((f, idx) => ({
        feature: f,
        productId: state.productId || null,
        id: idx + 1,
      })),
    });
  };

  const toggleFeature = (feature) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    
    setSelectedFeatures(updated);
    updateGlobalState(updated);
  };

  const handleAddCustom = () => {
    if (customFeature.trim() && !featureOptions.includes(customFeature)) {
      const updatedOptions = [...featureOptions, customFeature.trim()];
      setFeatureOptions(updatedOptions);
      toggleFeature(customFeature.trim());
      setCustomFeature("");
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center', gap: 1 }}>
        <VerifiedIcon /> Product Highlights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Select the features that make this piece unique for your customers.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "#FDFCFB", mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 700 }}>
          POPULAR FEATURES
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {featureOptions.map((feature) => {
            const isSelected = selectedFeatures.includes(feature);
            return (
              <Chip
                key={feature}
                label={feature}
                onClick={() => toggleFeature(feature)}
                color={isSelected ? "secondary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                icon={isSelected ? <AutoAwesomeIcon /> : undefined}
                sx={{ 
                  py: 2.5, 
                  px: 1, 
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  transition: "0.2s",
                  "&:hover": { transform: "translateY(-2px)" }
                }}
              />
            );
          })}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 700 }}>
          ADD CUSTOM HIGHLIGHT
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g., 22K Gold Plated"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddCustom}
            sx={{ bgcolor: "#4A2E2E", color: "#D8B67B", minWidth: 120 }}
          >
            Add
          </Button>
        </Stack>
      </Paper>

      {selectedFeatures.length === 0 && (
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
          Adding at least one feature helps in product discoverability.
        </Alert>
      )}

      {selectedFeatures.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <b>{selectedFeatures.length}</b> features selected for this product.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductFeatureStep;