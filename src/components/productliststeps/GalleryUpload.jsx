import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Paper, IconButton, Grid, 
  Stack, alpha, Button, CircularProgress 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import sellerApi from "../../api/sellerApi"; // your API instance

const GalleryUpload = ({ state, dispatch }) => {
  const [uploading, setUploading] = useState(false);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      state.images?.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [state.images]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    dispatch({ images: [...(state.images || []), ...newImages] });
    e.target.value = null; // reset input
  };

  const removeImage = (index) => {
    const updatedImages = [...state.images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    dispatch({ images: updatedImages });
  };

  const moveImage = (index, direction) => {
    const updatedImages = [...state.images];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= updatedImages.length) return;

    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    dispatch({ images: updatedImages });
  };

  // Upload all images to backend
  const uploadAllImages = async () => {
    if (!state.productId) return alert("Product ID missing!");
    if (!state.images || state.images.length === 0) return alert("No images to upload!");

    setUploading(true);
    try {
      await Promise.all(
        state.images.map(async (img) => {
          const formData = new FormData();
          formData.append("files", img.file); // your backend expects 'files'
          await sellerApi.uploadImage(state.productId, formData);
        })
      );
      alert("All gallery images uploaded successfully!");
      // Optionally, mark uploaded images or clear
      dispatch({ images: [] });
    } catch (err) {
      console.error("Failed to upload images:", err);
      alert("Failed to upload images. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography 
        variant="h5" 
        sx={{ mb: 1, fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CollectionsIcon /> Product Gallery
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Upload lifestyle shots. Use arrows to set the display order.
      </Typography>

      <Grid container spacing={2}>
        {state.images?.map((img, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                position: "relative",
                pt: "100%", 
                borderRadius: 3,
                overflow: "hidden",
                border: "2px solid #eee",
                bgcolor: "white"
              }}
            >
              <Box
                component="img"
                src={img.preview}
                sx={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover"
                }}
              />

              {/* Overlay Actions */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                bgcolor: 'rgba(0,0,0,0.5)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 0.5 
              }}>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => moveImage(index, -1)} disabled={index === 0} sx={{ color: "white" }}>
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => moveImage(index, 1)} disabled={index === state.images.length - 1} sx={{ color: "white" }}>
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <IconButton size="small" onClick={() => removeImage(index)} sx={{ color: "#ff4d4d" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              {index === 0 && (
                <Box sx={{ position: 'absolute', top: 5, left: 5 }}>
                  <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: 'white', px: 1, borderRadius: 1, fontWeight: 700 }}>
                    MAIN
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}

        {/* Add Photo Card */}
        <Grid item xs={6} sm={4} md={3}>
          <Paper
            component="label"
            sx={{
              pt: "100%",
              position: "relative",
              borderRadius: 3,
              border: "2px dashed #D8B67B",
              bgcolor: alpha("#D8B67B", 0.05),
              cursor: "pointer",
              display: 'block',
              transition: "0.2s",
              "&:hover": { bgcolor: alpha("#D8B67B", 0.1), transform: 'scale(1.02)' }
            }}
          >
            <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            >
              <AddPhotoAlternateIcon sx={{ color: "secondary.main", fontSize: 40, mb: 1 }} />
              <Typography variant="button" sx={{ fontWeight: 700, color: "secondary.main" }}>Add Photo</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Upload All Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={uploadAllImages}
          disabled={uploading || !state.images?.length}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {uploading ? "Uploading..." : "Upload All Images"}
        </Button>
      </Box>
    </Box>
  );
};

export default GalleryUpload;
