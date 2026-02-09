import axios from "axios";

// ===========================
// AXIOS INSTANCE
// ===========================
const SellerApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===========================
// JWT INTERCEPTOR
// ===========================
SellerApi.interceptors.request.use(
  (config) => {
    // Public endpoints: don't attach token
    const publicEndpoints = ["/brands", "/attributes", "/products/page"];

    // Handle subpaths
    const isPublic = publicEndpoints.some(
      (endpoint) =>
        config.url.startsWith(endpoint) || config.url.startsWith(endpoint + "/")
    );

    if (!isPublic) {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================
// SELLER API METHODS
// ===========================
const sellerApi = {
  // ---------------------------
  // BRANDS
  // ---------------------------
  getAllBrands: () => SellerApi.get("/brands").then((res) => res.data),

  // ---------------------------
  // ATTRIBUTES
  // ---------------------------
  getAllAttributes: async () => {
    const res = await SellerApi.get("/attributes");
    return (res.data || []).map((attr) => ({
      id: attr.id ?? Math.random(),
      name: attr.name ?? "Unknown Attribute",
      values: (attr.values || []).map((val, index) => ({
        id: val.id ?? index,
        name: val.value ?? val ?? "Unknown Value",
      })),
    }));
  },

  saveAttributes: (productId, attributes) =>
    SellerApi.post(`/products/${productId}/attributes`, attributes).then(
      (res) => res.data
    ),

  // ---------------------------
  // PRODUCTS
  // ---------------------------
  createProduct: (data) =>
    SellerApi.post("/products", data).then((res) => res.data),

  getProductListing: () =>
    SellerApi.get("/products/page").then((res) => res.data),

  getProductPage: (productId) => {
    if (!productId) throw new Error("productId required");
    return SellerApi.get(`/products/page/${productId}/page`).then(
      (res) => res.data
    );
  },

  // ---------------------------
  // PRODUCT IMAGES
  // ---------------------------
  uploadImage: (productId, formData) => {
    if (!productId) throw new Error("Product ID is required");
    return SellerApi.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data);
  },

  getProductImages: (productId) => {
    if (!productId) throw new Error("productId is required");
    return SellerApi.get(`/products/${productId}/images`).then((res) => res.data);
  },

  // ---------------------------
  // VARIANTS
  // ---------------------------
  createVariant: (productId, data) =>
    SellerApi.post(`/products/${productId}/variants`, data).then((res) => res.data),

  getVariants: (productId) => {
    if (!productId) throw new Error("productId is required");
    return SellerApi.get(`/products/${productId}/variants`).then((res) => res.data);
  },

  // ---------------------------
  // VARIANT PRICING
  // ---------------------------
  setVariantPrice: (variantId, data) =>
    SellerApi.post(`/variants/${variantId}/pricing/price`, data).then(
      (res) => res.data
    ),

  setVariantDiscount: (variantId, data) =>
    SellerApi.post(`/variants/${variantId}/pricing/discount`, data).then(
      (res) => res.data
    ),

  // ---------------------------
  // FEATURES
  // ---------------------------
  saveFeatures: (productId, payload) => {
    const features = payload.map((f) =>
      typeof f === "string" ? f : f.feature || f.text
    );
    return SellerApi.post(`/products/${productId}/features`, features).then(
      (res) => res.data
    );
  },

  // ---------------------------
  // SPECIFICATIONS
  // ---------------------------
  saveSpecifications: (productId, specs) =>
    SellerApi.post(`/products/${productId}/specifications/bulk`, specs).then(
      (res) => res.data
    ),

  getSpecifications: (productId) => {
    if (!productId) throw new Error("productId is required");
    return SellerApi.get(`/products/${productId}/specifications`)
      .then((res) => (Array.isArray(res.data) ? res.data : []))
      .catch(() => []);
  },

  // ---------------------------
  // MANUFACTURER
  // ---------------------------
  saveManufacturer: (productId, content) =>
    SellerApi.post(`/products/${productId}/manufacturer`, content).then(
      (res) => res.data
    ),
};

export default sellerApi;
