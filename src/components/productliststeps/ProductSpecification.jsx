import React, { useState, useEffect } from "react";
import { 
  Box, Typography, TextField, Button, Paper, 
  IconButton, Stack, Grid, Divider 
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DiamondIcon from '@mui/icons-material/Diamond';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const ProductSpecificationStep = ({ state, dispatch }) => {
  const defaultSpecs = [
    { key: "Metal", value: "" },
    { key: "Gemstone", value: "" },
    { key: "Weight (g)", value: "" },
    { key: "Ring Size", value: "" },
    { key: "Dimensions (mm)", value: "" },
  ];

  const [specs, setSpecs] = useState(
    state.specifications && state.specifications.length 
      ? state.specifications.map(s => ({ key: s.specKey || "", value: s.specValue || "" })) 
      : defaultSpecs
  );

  // Sync internal state with external changes (if any)
  useEffect(() => {
    if (state.specifications && state.specifications.length) {
      const formatted = state.specifications.map(s => ({
        key: s.specKey || "",
        value: s.specValue || ""
      }));
      // Only set if actually different to prevent render loops
      if (JSON.stringify(formatted) !== JSON.stringify(specs)) {
        setSpecs(formatted);
      }
    }
  }, [state.specifications]);

  const handleUpdate = (updatedSpecs) => {
    setSpecs(updatedSpecs);
    dispatch({
      specifications: updatedSpecs.map((s, i) => ({
        id: i + 1,
        productId: state.productId || null,
        specKey: s.key,
        specValue: s.value,
      })),
    });
  };

  const handleChange = (idx, field, value) => {
    const updated = [...specs];
    updated[idx][field] = value;
    handleUpdate(updated);
  };

  const addSpec = () => {
    handleUpdate([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (idx) => {
    handleUpdate(specs.filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center', gap: 1 }}>
        <DiamondIcon /> Technical Specifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Provide precise details about the craftsmanship and materials.
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, bgcolor: "#FDFCFB", border: "1px solid #eee" }}>
        <Stack spacing={2}>
          {specs.map((spec, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Attribute Name"
                  placeholder="e.g. Metal Purity"
                  value={spec.key}
                  onChange={(e) => handleChange(idx, "key", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Value"
                  placeholder="e.g. 18K Yellow Gold"
                  value={spec.value}
                  onChange={(e) => handleChange(idx, "value", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "right" }}>
                <IconButton 
                  onClick={() => removeSpec(idx)} 
                  color="error" 
                  disabled={specs.length === 1}
                  sx={{ bgcolor: "rgba(211, 47, 47, 0.05)", "&:hover": { bgcolor: "rgba(211, 47, 47, 0.1)" } }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Grid>
              {idx < specs.length - 1 && (
                <Grid item xs={12}>
                  <Divider sx={{ opacity: 0.5 }} />
                </Grid>
              )}
            </Grid>
          ))}
        </Stack>

        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={addSpec}
          variant="text"
          sx={{ mt: 3, color: "secondary.main", fontWeight: 700 }}
        >
          Add Custom Field
        </Button>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, color: "text.secondary" }}>
        <SettingsSuggestIcon fontSize="small" />
        <Typography variant="caption">
          Tip: Be specific about weights and dimensions to reduce customer inquiries.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductSpecificationStep;