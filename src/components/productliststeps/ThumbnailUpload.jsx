import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, Typography, Grid, Paper, IconButton, 
  Stack, Chip, alpha, Tooltip, Button, CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import sellerApi from "../../api/sellerApi";

const ThumbnailUpload = ({ state, dispatch }) => {
  const [uploading, setUploading] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      state.variants.forEach(v => v.previewUrl && URL.revokeObjectURL(v.previewUrl));
    };
  }, [state.variants]);

  // Memoized uploaded thumbnails count
  const uploadedCount = useMemo(
    () => state.variants.filter(v => v.thumbnailFile).length,
    [state.variants]
  );

  // Select file for a single variant card
  const handleFileChange = (variantId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const updatedVariants = state.variants.map(v => {
      if (v.id === variantId || v.sku === variantId) {
        v.previewUrl && URL.revokeObjectURL(v.previewUrl);
        return { ...v, thumbnailFile: file, previewUrl, hasChanged: true };
      }
      return v;
    });

    dispatch({ variants: updatedVariants });
  };

  // Remove image from a variant
  const removeImage = (variantId) => {
    const updatedVariants = state.variants.map(v => {
      if (v.id === variantId || v.sku === variantId) {
        v.previewUrl && URL.revokeObjectURL(v.previewUrl);
        return { ...v, thumbnailFile: null, previewUrl: null };
      }
      return v;
    });
    dispatch({ variants: updatedVariants });
  };

  // Upload all selected thumbnails
  const uploadAllThumbnails = async () => {
    if (!state.productId) return alert("Product ID missing!");

    const filesToUpload = state.variants.filter(v => v.thumbnailFile);
    if (!filesToUpload.length) return alert("No thumbnails to upload!");

    setUploading(true);
    try {
      await Promise.all(
        filesToUpload.map(async v => {
          const fd = new FormData();
          fd.append("files", v.thumbnailFile); // ✅ match backend
          await sellerApi.uploadImage(state.productId, fd);
          console.log(`✅ Uploaded thumbnail for SKU: ${v.sku}`);
        })
      );
      dispatch({ thumbnailSaved: true });
      alert("All thumbnails uploaded successfully!");
    } catch (err) {
      console.error("❌ Failed to upload thumbnails", err);
      alert("Failed to upload thumbnails. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center' }}>
            <PhotoCameraIcon sx={{ mr: 1 }} /> Variant Thumbnails
          </Typography>
          <Typography variant="body2" color="text.secondary">
            High-quality thumbnails improve conversion by 40% for luxury jewelry.
          </Typography>
        </Box>
        <Chip 
          icon={<CheckCircleIcon />} 
          label={`${uploadedCount} / ${state.variants.length} Set`}
          color="secondary"
          variant="outlined"
        />
      </Stack>

      {/* Variants Grid */}
      <Grid container spacing={3}>
        {state.variants.map((variant, index) => (
          <Grid item xs={12} sm={6} md={4} key={variant.sku || index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "2px solid",
                borderColor: variant.thumbnailFile ? "secondary.main" : "divider",
                bgcolor: variant.thumbnailFile ? alpha("#D8B67B", 0.02) : "#fff",
                transition: "all 0.3s ease"
              }}
            >
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={variant.sku} size="small" sx={{ fontWeight: 700, bgcolor: "primary.main", color: "white" }} />
                {variant.price && <Chip label={`₹${variant.price}`} size="small" variant="outlined" />}
              </Stack>

              <Box
                sx={{
                  height: 180,
                  border: "2px dashed",
                  borderColor: variant.thumbnailFile ? "secondary.main" : "#ccc",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": { bgcolor: alpha("#D8B67B", 0.05) }
                }}
              >
                {variant.previewUrl ? (
                  <>
                    <img 
                      src={variant.previewUrl} 
                      alt="preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                      <Tooltip title="Remove">
                        <IconButton 
                          size="small" 
                          onClick={() => removeImage(variant.sku)}
                          sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No Thumbnail Uploaded
                  </Typography>
                )}

                {/* Hidden file input for this card */}
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  id={`file-input-${variant.sku}`} 
                  onChange={(e) => handleFileChange(variant.sku, e)}
                />
              </Box>

              {/* Click box to select file */}
              <Button 
                variant="outlined" 
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => document.getElementById(`file-input-${variant.sku}`).click()}
              >
                {variant.thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Upload All Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button 
          variant="contained"
          onClick={uploadAllThumbnails}
          disabled={uploading || uploadedCount === 0}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCameraIcon />}
        >
          {uploading ? "Uploading..." : "Upload All Thumbnails"}
        </Button>
      </Box>
    </Box>
  );
};

export default ThumbnailUpload;
