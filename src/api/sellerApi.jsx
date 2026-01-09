import axios from "axios";

const SellerApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically
SellerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sellerApi = {
  // ---------------------------
  // BRAND
  // ---------------------------
  getAllBrands: async () => {
    try {
      const res = await SellerApi.get("/brands");
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch brands, using dev fallback");
      return [
        { id: 1, name: "At luxe plus" },
        { id: 2, name: "At luxe star" },
      ];
    }
  },

  // ---------------------------
  // ATTRIBUTES
  // ---------------------------
  getAllAttributes: async () => {
    try {
      const res = await SellerApi.get("/attributes");
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch attributes, using dev fallback");
      return [];
    }
  },

  // ---------------------------
  // PRODUCT
  // ---------------------------
  createProduct: async (data) => {
    try {
      const res = await SellerApi.post("/products", data);
      return res.data;
    } catch (err) {
      console.warn("Failed to create product, using dev fallback ID");
      return { id: 999, ...data }; // dev fallback ID
    }
  },

  getProductBySlug: (slug) => SellerApi.get(`/products/${slug}`),
  getProductListing: () => SellerApi.get("/products"),

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  deleteProduct: async (productId) => {
    try {
      const res = await SellerApi.delete(`/products/${productId}`);
      return res.data;
    } catch (err) {
      console.error(`Failed to delete product ${productId}:`, err);
      throw err;
    }
  },

  // ---------------------------
  // VARIANT
  // ---------------------------
  createVariant: (productId, data) =>
    SellerApi.post(`/products/${productId}/variants`, data),
  getVariants: (productId) =>
    SellerApi.get(`/products/${productId}/variants`),

  // ---------------------------
  // VARIANT PRICING
  // ---------------------------
  setVariantPrice: (variantId, data) =>
    SellerApi.post(`/variants/${variantId}/pricing/price`, data),
  setVariantDiscount: (variantId, data) =>
    SellerApi.post(`/variants/${variantId}/pricing/discount`, data),
  getVariantPricing: (variantId) =>
    SellerApi.get(`/variants/${variantId}/pricing`),

  // ---------------------------
  // PRODUCT IMAGES
  // ---------------------------
  uploadProductImages: (productId, files, variantId) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (variantId) formData.append("variantId", variantId);

    return SellerApi.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getProductImages: (productId, variantId) =>
    SellerApi.get(`/products/${productId}/images`, {
      params: variantId ? { variantId } : {},
    }),

  // ---------------------------
  // DEV FALLBACK FUNCTIONS
  // ---------------------------
  saveAttributes: async (productId, attributes) => {
    console.log("Saving attributes (dev fallback):", productId, attributes);
  },
  saveFeatures: async (productId, features) => {
    console.log("Saving features (dev fallback):", productId, features);
  },
  saveSpecifications: async (productId, specifications) => {
    console.log("Saving specifications (dev fallback):", productId, specifications);
  },
  saveManufacturerInfo: async (productId, manufacturer) => {
    console.log("Saving manufacturer (dev fallback):", productId, manufacturer);
  },
};

export default sellerApi;
