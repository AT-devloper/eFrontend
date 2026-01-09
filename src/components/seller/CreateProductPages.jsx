import React, { useState } from "react";
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
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Full controlled state
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
  });

  // Central dispatch function
  const dispatch = (update) =>
    setState((prev) => ({ ...prev, ...update }));

  // Go to next step
  const goNext = async () => {
    const currentStep = steps[activeStepIndex];

    try {
      switch (currentStep) {
        case "Category":
          if (!state.categoryId) return alert("Select a category!");
          break;

        case "Brand":
          if (!state.brandId) return alert("Select a brand!");
          break;

        case "Product Information":
          if (!state.productInfo.name)
            return alert("Enter product name!");
          const productData = {
            categoryId: state.categoryId,
            brandId: state.brandId,
            ...state.productInfo,
          };
          const res = await sellerApi.createProduct(productData);
          dispatch({ productId: res.id });
          break;

        case "Attributes":
          if (!state.attributes || Object.keys(state.attributes).length === 0)
            return alert("Select at least one attribute");

          const attrPayload = Object.entries(state.attributes).map(
            ([id, value]) => ({ attributeId: parseInt(id), value })
          );

          await sellerApi.saveAttributes(state.productId, attrPayload);
          break;

        case "Variants":
  if (!state.variants || state.variants.length === 0)
    return alert("Add at least one variant");

  const createdVariants = [];
  for (const variant of state.variants) {
    const payload = {
      sku: variant.sku,
      attributes: Object.entries(state.attributes).map(
        ([id, value]) => ({ attributeId: parseInt(id), value })
      ),
    };

    // Create variant in backend
    const v = await sellerApi.createVariant(state.productId, payload);
    const variantId = v.id || variant.id;
    createdVariants.push({ ...variant, id: variantId });

    // Upload variant images if any
    if (variant.images?.length > 0) {
      await sellerApi.uploadProductImages(
        state.productId,
        variant.images,
        variantId
      );
    }
  }

  dispatch({ variants: createdVariants });
  break;

        case "Pricing":
          for (const variant of state.variants) {
            if (!variant.id) continue;
            if (variant.price) {
              await sellerApi.setVariantPrice(variant.id, {
                mrp: variant.price.mrp,
                sellingPrice: variant.price.sellingPrice,
              });
            }
            if (variant.discount) {
              await sellerApi.setVariantDiscount(variant.id, {
                discountType: variant.discount.discountType,
                discountValue: variant.discount.discountValue,
              });
            }
          }
          break;

        case "Thumbnail Image":
  if (state.thumbnailFile) {
    // Upload thumbnail automatically
    await sellerApi.uploadProductImages(
      state.productId,
      [state.thumbnailFile]
    );
  }
  break;




        case "Features":
          await sellerApi.saveFeatures(state.productId, state.features);
          break;

        case "Specifications":
          await sellerApi.saveSpecifications(
            state.productId,
            state.specifications
          );
          break;

        case "From Manufacturer":
          await sellerApi.saveManufacturerInfo(
            state.productId,
            state.manufacturer
          );
          break;

        case "Gallery Upload":
  if (state.images.length > 0) {
    // Upload all gallery images automatically
    await sellerApi.uploadProductImages(
      state.productId,
      state.images
    );
  }
  break;

        default:
          break;
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong! Using dev fallback where possible.");
    }

    if (activeStepIndex < steps.length - 1)
      setActiveStepIndex(activeStepIndex + 1);
  };

  const goBack = () => {
    if (activeStepIndex > 0) setActiveStepIndex(activeStepIndex - 1);
  };

  const renderStep = () => {
    const stepProps = { state, dispatch };
    switch (steps[activeStepIndex]) {
      case "Category":
        return <CategoryStep {...stepProps} />;
      case "Brand":
        return <BrandStep {...stepProps} />;
      case "Product Information":
        return <ProductInfoStep {...stepProps} />;
      case "Attributes":
        return <AttributeSelection {...stepProps} />;
      case "Variants":
        return <VariantStep {...stepProps} />;
      case "Pricing":
        return <PricingStep {...stepProps} />;
      case "Thumbnail Image":
        return <ThumbnailUpload {...stepProps} />;
      case "Features":
        return <ProductFeatureStep {...stepProps} />;
      case "Specifications":
        return <ProductSpecification {...stepProps} />;
      case "From Manufacturer":
        return <ProductManufact {...stepProps} />;
      case "Gallery Upload":
        return <GalleryUpload {...stepProps} />;
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
                key={idx}
                className={`seller-step ${activeStepIndex === idx ? "active" : ""}`}
                onClick={() => setActiveStepIndex(idx)}
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
                <button onClick={goNext} className="btn-gold">
                  Save & Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SellerLayout>
  );
};

export default CreateProductPage;
