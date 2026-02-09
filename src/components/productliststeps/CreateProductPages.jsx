import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Button, Typography, Paper, Stack, Divider,
  Snackbar, Alert, CircularProgress
} from "@mui/material";

import SellerLayout from "../../layouts/SellerLayout";
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
  "Category", "Brand", "Product Information", "Attributes", "Variants",
  "Pricing", "Thumbnail Image", "Features", "Specifications", "From Manufacturer", "Gallery Upload",
];

const CreateProductPage = () => {
  const navigate = useNavigate();

  // Main State
  const [state, setState] = useState({
    categoryId: "",
    brandId: "",
    productInfo: { name: "", description: "", sku: "", weight: "" },
    attributeSets: [],     // Each set: { attrId: [valueIds] }
    variants: [],
    features: [],
    specifications: [],
    manufacturer: "",
    thumbnailFile: null,
    images: [],
    productId: null,
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const dispatch = (update) => setState((prev) => ({ ...prev, ...update }));

  const requireProductId = () => {
    if (!state.productId) {
      alert("Please complete Product Information first");
      throw new Error("productId missing");
    }
  };

  const goNext = async () => {
    const currentStep = steps[activeStepIndex];
    setLoading(true);
    try {
      console.log(`=== Step Started: ${currentStep} ===`);

      switch (currentStep) {
        // --------------------
        case "Category":
          console.log("Selected Category:", state.categoryId);
          if (!state.categoryId) return alert("Select a category");
          break;

        // --------------------
        case "Brand":
          console.log("Selected Brand:", state.brandId);
          if (!state.brandId) return alert("Select a brand");
          break;

        // --------------------
        case "Product Information":
          console.log("Product Info:", state.productInfo);
          if (!state.productInfo.name) return alert("Enter product name");

          const productData = {
            categoryId: state.categoryId,
            brandId: state.brandId,
            ...state.productInfo,
          };
          console.log("Payload for createProduct:", productData);
          const productRes = await sellerApi.createProduct(productData);
          console.log("Created Product Response:", productRes);
          dispatch({ productId: productRes.id || productRes.productId });
          break;

        // --------------------
        case "Attributes":
          requireProductId();
          if (!state.attributeSets.length) return alert("Select at least one attribute set");

          // Merge all attribute sets
          const mergedAttributes = {};
          state.attributeSets.forEach((set) => {
            Object.entries(set).forEach(([attrId, valIds]) => {
              mergedAttributes[attrId] = Array.from(
                new Set([...(mergedAttributes[attrId] || []), ...valIds.map(Number)])
              );
            });
          });

          const payload = Object.entries(mergedAttributes).map(([attrId, valIds]) => ({
            attributeId: Number(attrId),
            valueIds: valIds.map(Number),
          }));

          console.log("Payload for saveAttributes:", payload);
          await sellerApi.saveAttributes(state.productId, payload);
          console.log("Attributes saved successfully");
          break;

        // --------------------
// --------------------
// Variants Step
// --------------------
case "Variants": {
  requireProductId();
  console.log("Variants before saving:", state.variants);

  if (!state.variants.length) return alert("Add at least one variant");

  const createdVariants = [];

  for (const variant of state.variants) {
    // Prepare payload for backend
    const payload = {
      sku: variant.sku,
      stock: Number(variant.stock) || 0,
      attributes: {},
    };

    // Convert attributes array to object map
    Object.entries(state.attributes).forEach(([attrId, valIds]) => {
      if (valIds.length > 0) {
        // Only take the first selected value for this attribute
        payload.attributes[attrId] = Number(valIds[0]);
      }
    });

    console.log("Payload for createVariant:", payload);

    try {
      const res = await sellerApi.createVariant(state.productId, payload);
      console.log("Variant Created:", res);

      const backendVariantId = res.id || res.variantId;

      // Save price & discount if available
      if (variant.price) {
        await sellerApi.setVariantPrice(backendVariantId, {
          mrp: Number(variant.price.mrp) || 0,
          sellingPrice: Number(variant.price.sellingPrice) || 0,
        });
        if (variant.discount) {
          await sellerApi.setVariantDiscount(backendVariantId, {
            discountType: variant.discount.discountType || "PERCENT",
            discountValue: Number(variant.discount.discountValue) || 0,
          });
        }
      }

      createdVariants.push({ ...variant, id: backendVariantId });
    } catch (err) {
      console.error(`Failed to create/save variant ${variant.sku}`, err);
      alert(`Failed to create variant ${variant.sku}: ${err.response?.data?.message || err.message}`);
    }
  }

  dispatch({ variants: createdVariants });
  console.log("All Variants Saved:", createdVariants);
  break;
}



        // --------------------
        case "Pricing":
          requireProductId();
          for (const v of state.variants) {
            if (!v.id) continue;
            console.log("Setting price for variant:", v.sku);
            await sellerApi.setVariantPrice(v.id, {
              mrp: Number(v.price?.mrp || 0),
              sellingPrice: Number(v.price?.sellingPrice || 0),
            });
            await sellerApi.setVariantDiscount(v.id, {
              discountType: v.discount?.discountType || "PERCENT",
              discountValue: Number(v.discount?.discountValue || 0),
            });
          }
          console.log("Pricing saved");
          break;

        // --------------------
        case "Thumbnail Image":
          requireProductId();
          if (state.thumbnailFile) {
            console.log("Uploading thumbnail:", state.thumbnailFile);
            const formData = new FormData();
            formData.append("file", state.thumbnailFile);
            await sellerApi.uploadImage(state.productId, formData);
          }
          break;

        // --------------------
      case "Features": {
  requireProductId();

  if (!state.features.length) return alert("Add at least one feature");

  // Convert features to array of strings
  const payload = state.features.map(f => (typeof f === "string" ? f : f.feature || f.text || ""));
  console.log("Saving features:", payload);

  try {
    await sellerApi.saveFeatures(state.productId, payload);
    console.log("Features saved successfully");
  } catch (err) {
    console.error("API Error:", err);
    alert("Failed to save features: " + (err.response?.data?.message || err.message));
  }
  break;
}


        // --------------------
        case "Specifications":
          requireProductId();
          if (!state.specifications.length) return alert("Add at least one specification");
          console.log("Saving specifications:", state.specifications);
          await sellerApi.saveSpecifications(state.productId, state.specifications);
          break;

        // --------------------
        case "From Manufacturer":
          requireProductId();
          if (!state.manufacturer) return alert("Enter manufacturer info");
          console.log("Saving manufacturer info:", state.manufacturer);
          await sellerApi.saveManufacturer(state.productId, { name: state.manufacturer });
          break;

        // --------------------
        case "Gallery Upload":
          requireProductId();
          if (state.images.length) {
            console.log("Uploading gallery images:", state.images);
            for (const file of state.images) {
              const formData = new FormData();
              formData.append("file", file);
              await sellerApi.uploadImage(state.productId, formData);
            }
          }
          break;

        default:
          break;
      }

      console.log(`=== Step Finished: ${currentStep} ===`);
      setSuccessMsg(true);
      if (activeStepIndex < steps.length - 1) setActiveStepIndex(i => i + 1);

    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => { if (activeStepIndex > 0) setActiveStepIndex(i => i - 1); };

  const renderStep = () => {
    const props = { state, dispatch };
    const components = [
      <CategoryStep {...props} />, <BrandStep {...props} />, <ProductInfoStep {...props} />,
      <AttributeSelection {...props} />, <VariantStep {...props} />, <PricingStep {...props} />,
      <ThumbnailUpload {...props} />, <ProductFeatureStep {...props} />, <ProductSpecification {...props} />,
      <ProductManufact {...props} />, <GalleryUpload {...props} />
    ];
    return components[activeStepIndex];
  };

  return (
    <SellerLayout>
      <Snackbar open={successMsg} autoHideDuration={2000} onClose={() => setSuccessMsg(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Step Saved Successfully!</Alert>
      </Snackbar>

      <Box sx={{ bgcolor: "#f4f7fe", minHeight: "100vh", p: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Steps</Typography>
              {steps.map((step, idx) => (
                <Box
                  key={step}
                  onClick={() => { if (idx <= 2 || state.productId) setActiveStepIndex(idx); }}
                  sx={{
                    p: 1.5, mb: 1, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 2,
                    bgcolor: activeStepIndex === idx ? "primary.main" : "transparent",
                    color: activeStepIndex === idx ? "white" : "text.secondary",
                  }}
                >
                  <Box sx={{
                    width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: activeStepIndex > idx ? "success.main" : "grey.300", color: "white", fontSize: 12
                  }}>
                    {activeStepIndex > idx ? "✓" : idx + 1}
                  </Box>
                  <Typography variant="body2" fontWeight={activeStepIndex === idx ? 700 : 500}>{step}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 4, borderRadius: 4, minHeight: "70vh", display: "flex", flexDirection: "column" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 4 }}>{steps[activeStepIndex]}</Typography>
                {renderStep()}
              </Box>
              <Divider sx={{ my: 4 }} />
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={goBack} disabled={activeStepIndex === 0 || loading}>Back</Button>
                <Button variant="contained" onClick={activeStepIndex === steps.length - 1 ? () => navigate("/seller/products") : goNext} disabled={loading} sx={{ px: 4 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : activeStepIndex === steps.length - 1 ? "Finish" : "Save & Next"}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SellerLayout>
  );
};

export default CreateProductPage;
