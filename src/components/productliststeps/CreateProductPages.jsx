import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [state, setState] = useState({
    categoryId: "",
    brandId: "",
    productInfo: { name: "", description: "", sku: "", weight: "" },
    attributes: {},      // { attrId: [valIds] }
    variants: [],        // [{ sku, stock, price?, discount? }]
    features: [],
    specifications: [],
    manufacturer: "",
    thumbnailFile: null,
    images: [],
    productId: null,
  });

  const dispatch = (update) => setState((prev) => ({ ...prev, ...update }));

  // Ensure we have productId before some steps
  const requireProductId = () => {
    if (!state.productId) {
      alert("Please complete Product Information first");
      throw new Error("productId missing");
    }
    return true;
  };

  const goNext = async () => {
    const currentStep = steps[activeStepIndex];

    try {
      switch (currentStep) {
        case "Category":
          if (!state.categoryId) return alert("Select a category");
          break;

        case "Brand":
          if (!state.brandId) return alert("Select a brand");
          break;

        case "Product Information": {
          if (!state.productInfo.name) return alert("Enter product name");

          const productData = {
            categoryId: state.categoryId,
            brandId: state.brandId,
            ...state.productInfo,
          };

          const res = await sellerApi.createProduct(productData);
          dispatch({ productId: res.productId || res.id });
          break;
        }

        case "Attributes": {
          requireProductId();
          if (!state.attributes || Object.keys(state.attributes).length === 0) {
            return alert("Select at least one attribute");
          }

          const payload = Object.entries(state.attributes).flatMap(([attrId, valIds]) =>
            valIds.map((valId) => ({
              attributeId: Number(attrId),
              valueId: Number(valId),
            }))
          );

          await sellerApi.saveAttributes(state.productId, payload);
          break;
        }

        case "Variants": {
          requireProductId();
          if (!state.variants.length) return alert("Add at least one variant");

          const createdVariants = [];

          for (const variant of state.variants) {
            const attributeArray = Object.entries(state.attributes).flatMap(
              ([attrId, valIds]) => valIds.map((valId) => ({
                attributeId: Number(attrId),
                valueId: Number(valId),
              }))
            );

            const payload = {
              sku: variant.sku,
              stock: Number(variant.stock) || 0,
              attributes: attributeArray,
            };

            try {
              const res = await sellerApi.createVariant(state.productId, payload);
              const backendVariantId = res.id || res.variantId;

              // Set price and discount if available
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
              alert(`Failed to create/save variant ${variant.sku}`);
            }
          }

          dispatch({ variants: createdVariants });
          break;
        }

        case "Pricing": {
          requireProductId();
          for (const v of state.variants) {
            if (!v.id) continue;
            const mrp = Number(v.price?.mrp) || 0;
            const sellingPrice = Number(v.price?.sellingPrice) || 0;
            const discountValue = Number(v.discount?.discountValue) || 0;
            try {
              await sellerApi.setVariantPrice(v.id, { mrp, sellingPrice });
              await sellerApi.setVariantDiscount(v.id, {
                discountType: v.discount?.discountType || "PERCENT",
                discountValue,
              });
            } catch (err) {
              console.error(`Failed to save pricing for ${v.sku}`, err.response || err);
              alert(`Failed to save pricing for ${v.sku}`);
            }
          }
          break;
        }

        case "Thumbnail Image":
          requireProductId();
          if (state.thumbnailFile) {
            await sellerApi.uploadProductImages(state.productId, [state.thumbnailFile]);
          }
          break;

        case "Features":
          requireProductId();
          if (!state.features.length) return alert("Add at least one feature");
          await sellerApi.saveFeatures(
            state.productId,
            state.features.map((f) => ({ feature: f.feature, productId: state.productId }))
          );
          break;

        case "Specifications":
          requireProductId();
          if (!state.specifications.length) return alert("Add at least one specification");
          await sellerApi.saveSpecifications(state.productId, state.specifications);
          break;

        case "From Manufacturer":
          requireProductId();
          if (!state.manufacturer) return alert("Enter manufacturer info");
          await sellerApi.saveManufacturerInfo(state.productId, state.manufacturer);
          break;

        case "Gallery Upload":
          requireProductId();
          if (state.images.length) {
            await sellerApi.uploadProductImages(state.productId, state.images);
          }
          break;

        default:
          break;
      }

      // Move to next step
      if (activeStepIndex < steps.length - 1) setActiveStepIndex((i) => i + 1);
    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const goBack = () => {
    if (activeStepIndex > 0) setActiveStepIndex((i) => i - 1);
  };

  const renderStep = () => {
    const props = { state, dispatch };
    switch (steps[activeStepIndex]) {
      case "Category":
        return <CategoryStep {...props} />;
      case "Brand":
        return <BrandStep {...props} />;
      case "Product Information":
        return <ProductInfoStep {...props} />;
      case "Attributes":
        return <AttributeSelection {...props} />;
      case "Variants":
        return <VariantStep {...props} />;
      case "Pricing":
        return <PricingStep {...props} />;
      case "Thumbnail Image":
        return <ThumbnailUpload {...props} />;
      case "Features":
        return <ProductFeatureStep {...props} />;
      case "Specifications":
        return <ProductSpecification {...props} />;
      case "From Manufacturer":
        return <ProductManufact {...props} />;
      case "Gallery Upload":
        return <GalleryUpload {...props} />;
      default:
        return null;
    }
  };

  return (
    <SellerLayout>
      <div className="container-fluid seller-wrapper">
        <div className="row">
          <aside className="col-md-3 col-lg-2 seller-sidebar">
            <h5>Create Product</h5>
            {steps.map((step, idx) => (
              <div
                key={step}
                className={`seller-step ${activeStepIndex === idx ? "active" : ""}`}
                onClick={() => {
                  if (idx > 2 && !state.productId) {
                    alert("Complete Product Information first");
                    return;
                  }
                  setActiveStepIndex(idx);
                }}
              >
                {step}
              </div>
            ))}
          </aside>

          <section className="col-md-9 col-lg-10 seller-content">
            <div className="seller-breadcrumb">
              Seller &gt; Products &gt; Create &gt; {steps[activeStepIndex]}
            </div>

            <div className="seller-card">
              {renderStep()}

              <div className="seller-actions">
                <button
                  onClick={goBack}
                  disabled={activeStepIndex === 0}
                  className="btn-back"
                >
                  Back
                </button>

                {activeStepIndex === steps.length - 1 ? (
                  <>
                    <button
                      onClick={async () => {
                        if (!state.images.length) return alert("Select images to upload.");
                        try {
                          requireProductId();
                          await sellerApi.uploadProductImages(state.productId, state.images);
                          alert("Images uploaded successfully!");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to upload images.");
                        }
                      }}
                      className="btn-secondary"
                    >
                      Upload
                    </button>

                    <button
                      onClick={() => {
                        if (!state.images.length)
                          return alert("Upload at least one image to complete.");
                        alert("Product listing completed!");
                        navigate("/seller/products");
                      }}
                      className="btn-gold"
                    >
                      Complete
                    </button>
                  </>
                ) : (
                  <button onClick={goNext} className="btn-gold">
                    Save & Next
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </SellerLayout>
  );
};

export default CreateProductPage;
