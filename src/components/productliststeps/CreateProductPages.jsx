import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Button, Typography, Paper, Stack, Divider,
  Snackbar, Alert, CircularProgress
} from "@mui/material";

import sellerApi from "../../api/sellerApi";

// Steps
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
  "Product Information",
  "Attributes",
  "Variants",
  "Pricing",
  "Thumbnail Image",
  "Features",
  "Specifications",
  "From Manufacturer",
  "Gallery Upload",
];

const CreateProductPage = () => {
  const navigate = useNavigate();

  const initialState = {
    categoryId: "",
    brandId: "",
    productInfo: { name: "", description: "", sku: "", weight: "" },
    attributeSets: [],
    variants: [],
    features: [],
    specifications: [],
    manufacturer: "",
    thumbnailFile: null,
    images: [],
    productId: null,
  };

  const [state, setState] = useState(initialState);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [productCompleted, setProductCompleted] = useState(false);

  const dispatch = (update) => setState((prev) => ({ ...prev, ...update }));

  const requireProductId = () => {
    if (!state.productId) {
      alert("Please complete Product Information first");
      throw new Error("productId missing");
    }
  };

  const resetForm = () => {
    setState(initialState);
    setActiveStepIndex(0);
    setProductCompleted(false);
  };

  const goNext = async () => {

    // 🔁 If already completed → Reset form
    if (productCompleted) {
      resetForm();
      return;
    }

    const currentStep = steps[activeStepIndex];
    setLoading(true);

    try {
      console.log(`=== Step Started: ${currentStep} ===`);

      switch (currentStep) {

        case "Category":
          if (!state.categoryId) return alert("Select a category");
          break;

        case "Brand":
          if (!state.brandId) return alert("Select a brand");
          break;

        case "Product Information":
          if (!state.productInfo.name) return alert("Enter product name");

          const productRes = await sellerApi.createProduct({
            categoryId: state.categoryId,
            brandId: state.brandId,
            ...state.productInfo,
          });

          dispatch({ productId: productRes.id || productRes.productId });
          break;

        case "Attributes":
          requireProductId();
          if (!state.attributeSets.length)
            return alert("Select at least one attribute");

          const merged = {};
          state.attributeSets.forEach((set) => {
            Object.entries(set).forEach(([attrId, valIds]) => {
              merged[attrId] = Array.from(
                new Set([...(merged[attrId] || []), ...valIds.map(Number)])
              );
            });
          });

          const payload = Object.entries(merged).map(([attrId, valIds]) => ({
            attributeId: Number(attrId),
            valueIds: valIds,
          }));

          await sellerApi.saveAttributes(state.productId, payload);
          break;

        case "Variants":
          requireProductId();
          if (!state.variants.length)
            return alert("Add at least one variant");

          const createdVariants = [];

          for (const variant of state.variants) {
            const res = await sellerApi.createVariant(state.productId, {
              sku: variant.sku,
              stock: Number(variant.stock) || 0,
              attributes: variant.attributes || {},
            });

            createdVariants.push({ ...variant, id: res.id || res.variantId });
          }

          dispatch({ variants: createdVariants });
          break;

        case "Pricing":
          requireProductId();
          for (const v of state.variants) {
            if (!v.id) continue;

            await sellerApi.setVariantPrice(v.id, {
              mrp: Number(v.price?.mrp || 0),
              sellingPrice: Number(v.price?.sellingPrice || 0),
            });

            await sellerApi.setVariantDiscount(v.id, {
              discountType: v.discount?.discountType || "PERCENT",
              discountValue: Number(v.discount?.discountValue || 0),
            });
          }
          break;

        case "Thumbnail Image":
          requireProductId();
          if (state.thumbnailFile) {
            const formData = new FormData();
            formData.append("file", state.thumbnailFile);
            await sellerApi.uploadImage(state.productId, formData);
          }
          break;

        case "Features":
          requireProductId();
          if (!state.features.length)
            return alert("Add at least one feature");

          await sellerApi.saveFeatures(
            state.productId,
            state.features.map((f) =>
              typeof f === "string" ? f : f.feature || ""
            )
          );
          break;

        case "Specifications":
          requireProductId();
          if (!state.specifications.length)
            return alert("Add at least one specification");

          await sellerApi.saveSpecifications(
            state.productId,
            state.specifications
          );
          break;

        case "From Manufacturer":
          requireProductId();
          if (!state.manufacturer)
            return alert("Enter manufacturer info");

          await sellerApi.saveManufacturer(state.productId, {
            name: state.manufacturer,
          });
          break;

        case "Gallery Upload":
          requireProductId();

          if (state.images.length) {
            for (const file of state.images) {
              const formData = new FormData();
              formData.append("file", file);
              await sellerApi.uploadImage(state.productId, formData);
            }
          }

          // 🎉 Mark Completed
          setProductCompleted(true);
          break;

        default:
          break;
      }

      console.log(`=== Step Finished: ${currentStep} ===`);

      setSuccessMsg(true);

      if (!productCompleted && activeStepIndex < steps.length - 1) {
        setActiveStepIndex((i) => i + 1);
      }

    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((i) => i - 1);
    }
  };

  const renderStep = () => {
    const props = { state, dispatch };
    const components = [
      <CategoryStep {...props} />,
      <BrandStep {...props} />,
      <ProductInfoStep {...props} />,
      <AttributeSelection {...props} />,
      <VariantStep {...props} />,
      <PricingStep {...props} />,
      <ThumbnailUpload {...props} />,
      <ProductFeatureStep {...props} />,
      <ProductSpecification {...props} />,
      <ProductManufact {...props} />,
      <GalleryUpload {...props} />,
    ];
    return components[activeStepIndex];
  };

  return (
    <>
      <Snackbar
        open={successMsg}
        autoHideDuration={2000}
        onClose={() => setSuccessMsg(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {productCompleted
            ? "Product Created Successfully!"
            : "Step Saved Successfully!"}
        </Alert>
      </Snackbar>

      <Box sx={{ bgcolor: "#f4f7fe", minHeight: "100vh", p: 4 }}>
        <Grid container spacing={3}>

          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Steps
              </Typography>

              {steps.map((step, idx) => (
                <Box
                  key={step}
                  onClick={() => {
                    if (idx <= 2 || state.productId)
                      setActiveStepIndex(idx);
                  }}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor:
                      activeStepIndex === idx
                        ? "primary.main"
                        : "transparent",
                    color:
                      activeStepIndex === idx
                        ? "white"
                        : "text.secondary",
                  }}
                >
                  {step}
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mb: 4 }}
                >
                  {steps[activeStepIndex]}
                </Typography>
                {renderStep()}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Stack direction="row" justifyContent="space-between">
                <Button
                  onClick={goBack}
                  disabled={activeStepIndex === 0 || loading}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={goNext}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : productCompleted ? (
                    "Create New Product"
                  ) : activeStepIndex === steps.length - 1 ? (
                    "Finish"
                  ) : (
                    "Save & Next"
                  )}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CreateProductPage;
