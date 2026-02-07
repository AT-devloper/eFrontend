import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import SellerLayout from "../../layouts/SellerLayout";
import sellerApi from "../../api/sellerApi";

// STEP COMPONENTS
import CategoryStep from "./CategoryStep";
import BrandStep from "./BrandStep";
import ProductInfoStep from "./ProductInfoStep";
import AttributeSelection from "./AttributeSelection";
import VariantStep from "./VariantStep";
import PricingStep from "./PricingStep";
import ThumbnailUpload from "./ThumbnailUpload";
import ProductFeatureStep from "./ProductFeatureStep";
import ProductSpecification from "./ProductSpecification";
import ProductManufact from "./ProductManufact";
import GalleryUpload from "./GalleryUpload";

const steps = [
  "Category",
  "Brand",
  "Info",
  "Attributes",
  "Variants",
  "Pricing",
  "Thumbnail",
  "Features",
  "Specs",
  "Manufacturer",
  "Gallery",
];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    categoryId: "",
    brandId: "",
    productInfo: {
      name: "",
      description: "",
      sku: "",
      weight: "",
    },
    attributes: {},
    variants: [],
    features: [],
    specifications: [],
    manufacturer: "",
    thumbnailFile: null,
    images: [],
    productId: null,

    // ✅ STEP COMPLETION FLAGS
    variantsSaved: false,
    pricingSaved: false,
    attributesSaved: false,
    infoSaved: false,
    thumbnailSaved: false,
    featuresSaved: false,
    specsSaved: false,
    manufacturerSaved: false,
    gallerySaved: false,
  });

  const dispatch = (update) =>
    setState((prev) => ({ ...prev, ...update }));

  // ===========================
  // NEXT STEP HANDLER
  // ===========================
  const goNext = async () => {
    if (loading) return;

    const currentStep = steps[activeStepIndex];
    setLoading(true);

    try {
      switch (currentStep) {
        case "Category":
          if (!state.categoryId) {
            alert("Select a category first!");
            return;
          }
          console.log("Category step completed:", state.categoryId);
          break;

        case "Brand":
          if (!state.brandId) {
            alert("Select a brand first!");
            return;
          }
          console.log("Brand step completed:", state.brandId);
          break;

        case "Info": {
          if (!state.infoSaved) {
            const res = await sellerApi.createProduct({
              categoryId: state.categoryId,
              brandId: state.brandId,
              ...state.productInfo,
            });
            dispatch({ productId: res.id || res.productId, infoSaved: true });
            console.log("Product Info saved:", res);
          }
          break;
        }

        case "Attributes": {
          if (!state.productId) {
            alert("Product ID missing!");
            return;
          }
          if (!state.attributesSaved) {
            const payload = Object.entries(state.attributes).flatMap(
              ([attrId, valIds]) =>
                valIds.map((valId) => ({
                  attributeId: Number(attrId),
                  valueId: Number(valId),
                }))
            );
            await sellerApi.saveAttributes(state.productId, payload);
            dispatch({ attributesSaved: true });
            console.log("Attributes saved:", payload);
          }
          break;
        }

        case "Variants":
          if (!state.variantsSaved) {
            alert("Save variants first in Variant Step!");
            return;
          }
          console.log("Variants step completed");
          break;

        case "Pricing":
          if (!state.pricingSaved) {
            alert("Save pricing first in Pricing Step!");
            return;
          }
          console.log("Pricing step completed");
          break;

        case "Thumbnail": {
  if (!state.productId) {
    alert("Product ID missing!");
    return;
  }

  if (!state.thumbnailSaved) {
    // Check if at least one variant has a file selected
    const hasFiles = state.variants.some(v => v.thumbnailFile);
    if (!hasFiles) {
      alert("Upload at least one thumbnail for your variants!");
      return;
    }

    try {
      // Prepare FormData
      const fd = new FormData();
      state.variants.forEach(v => {
        if (v.thumbnailFile) fd.append("images", v.thumbnailFile, v.sku);
      });

      // Upload all thumbnails via sellerApi
      console.log("Uploading all variant thumbnails...");
      await sellerApi.uploadImage(state.productId, fd);

      dispatch({ thumbnailSaved: true });
      console.log("✅ Thumbnails uploaded successfully");
      alert("All thumbnails uploaded!");
    } catch (err) {
      console.error("❌ Failed to upload thumbnails", err);
      alert("Failed to upload thumbnails. Check console.");
      return; // Stop step progression
    }
  }
  break;
}


        case "Features":
          if (!state.featuresSaved) {
            if (!state.features.length) {
              alert("Add at least one feature!");
              return;
            }
            await sellerApi.saveFeatures(state.productId, state.features);
            dispatch({ featuresSaved: true });
            console.log("Features saved:", state.features);
          }
          break;

        case "Specs":
          if (!state.specsSaved) {
            if (!state.specifications.length) {
              alert("Add at least one specification!");
              return;
            }
            await sellerApi.saveSpecifications(
              state.productId,
              state.specifications
            );
            dispatch({ specsSaved: true });
            console.log("Specifications saved:", state.specifications);
          }
          break;

        case "Manufacturer":
          if (!state.manufacturerSaved) {
            if (!state.manufacturer) {
              alert("Enter manufacturer info!");
              return;
            }
            await sellerApi.saveManufacturer(state.productId, state.manufacturer);
            dispatch({ manufacturerSaved: true });
            console.log("Manufacturer saved:", state.manufacturer);
          }
          break;

        case "Gallery": {
  if (!state.gallerySaved) {
    if (!state.images || state.images.length === 0) {
      alert("Upload at least one image!");
      return;
    }

    try {
      dispatch({ uploadingGallery: true }); // optional: set uploading state
      const fd = new FormData();
      state.images.forEach((img) => fd.append("files", img.file || img)); 
      // use img.file if stored as {file, preview}, fallback to img if raw File

      await sellerApi.uploadImage(state.productId, fd); // wait for upload
      dispatch({ gallerySaved: true, uploadingGallery: false });
      console.log("Gallery images uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload gallery images:", err);
      alert("Failed to upload gallery images. Check console.");
      dispatch({ uploadingGallery: false });
    }
  }
  break;
}


        default:
          break;
      }

      // ✅ Go to next step if not last
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex((prev) => prev + 1);
      } else {
        console.log("All steps completed! Product ID:", state.productId);
      }
    } catch (err) {
      console.error(`Error in step "${currentStep}":`, err);
      alert(`Error in step "${currentStep}". Check console.`);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  // ===========================
  // RENDER STEP
  // ===========================
  const renderStep = () => {
    const props = { state, dispatch };

    const map = {
      Category: <CategoryStep {...props} />,
      Brand: <BrandStep {...props} />,
      Info: <ProductInfoStep {...props} />,
      Attributes: <AttributeSelection {...props} />,
      Variants: <VariantStep {...props} />,
      Pricing: <PricingStep {...props} />,
      Thumbnail: <ThumbnailUpload {...props} />,
      Features: <ProductFeatureStep {...props} />,
      Specs: <ProductSpecification {...props} />,
      Manufacturer: <ProductManufact {...props} />,
      Gallery: <GalleryUpload {...props} />,
    };

    return map[steps[activeStepIndex]];
  };

  return (
    <SellerLayout>
      <Box p={{ xs: 2, md: 5 }} minHeight="100vh">
        <Box mb={4} display="flex" justifyContent="space-between">
          <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
              <MuiLink underline="none" color="primary">
                Dashboard
              </MuiLink>
              <Typography>Create Listing</Typography>
            </Breadcrumbs>
            <Typography variant="h4" fontWeight={800}>
              Product Wizard
            </Typography>
          </Box>
          <Typography>
            Step {activeStepIndex + 1} / {steps.length}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3 }}>
              <Stepper
                activeStep={activeStepIndex}
                orientation={isMobile ? "horizontal" : "vertical"}
              >
                {steps.map((label, idx) => (
                  <Step key={label} completed={activeStepIndex > idx}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 4, minHeight: "65vh" }}>
              <Box flexGrow={1}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStepIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Typography variant="h5" mb={3}>
                      {steps[activeStepIndex]}
                    </Typography>
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box display="flex" justifyContent="space-between">
                <Button disabled={activeStepIndex === 0 || loading} onClick={goBack}>
                  Back
                </Button>

                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={
                    activeStepIndex === steps.length - 1
                      ? () => navigate("/seller/products")
                      : goNext
                  }
                >
                  {loading ? (
                    <CircularProgress size={22} />
                  ) : activeStepIndex === steps.length - 1 ? (
                    "Finish"
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SellerLayout>
  );
};

export default CreateProductPage;
