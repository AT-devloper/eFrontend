import axios from "axios";

// Create Axios instance
const SellerApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Automatically attach JWT for protected routes
SellerApi.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/brands",
      "/attributes",
      "/products/page",
      "/products/page/",
    ];


    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.startsWith(endpoint)
    );

    if (!isPublic) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(
          "No JWT token found in localStorage. This request may fail."
        );
      }
    }

    console.log("Request URL:", config.url, "Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);


// ===========================
// SELLER API METHODS
// ===========================
const sellerApi = {
  // BRANDS
  getAllBrands: async () => {
    const res = await SellerApi.get("/brands");
    return res.data;
  },

  // ATTRIBUTES
  getAllAttributes: async () => {
    const res = await SellerApi.get("/attributes");
    return res.data;
  },

  // PRODUCTS
  createProduct: async (data) => {
    const res = await SellerApi.post("/products", data);
    return res.data;
  },

  getProductListing: async () => {
    const res = await SellerApi.get("/products/page");
    return res.data;
  },

  // ✅ SINGLE PRODUCT PAGE (IMPORTANT)
  getProductPage: async (productId) => {
    if (!productId) throw new Error("productId required");
    const res = await SellerApi.get(`/products/page/${productId}/page`);
    return res.data;
  },

  // OPTIONAL (keep if needed)
  deleteProduct: async (productId) => {
    const res = await SellerApi.delete(`/products/${productId}`);
    return res.data;
  },

  // PRODUCT IMAGES
  uploadProductImages: async (productId, files, variantId) => {
    if (!productId) throw new Error("productId is required");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (variantId) formData.append("variantId", variantId);

    const res = await SellerApi.post(
      `/products/${productId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  },

  getProductById: async (productId) => {
  const res = await axios.get(`/api/products/page/${productId}/page`);
  return res.data; // RETURN FULL PAGE RESPONSE
},


  getProductImages: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/images`);
    return res.data;
  },

  // VARIANTS
  createVariant: async (productId, data) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(`/products/${productId}/variants`, data);
    return res.data;
  },

  getVariants: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/variants`);
    return res.data;
  },

  // VARIANT PRICING
  setVariantPrice: async (variantId, data) => {
    if (!variantId) throw new Error("variantId is required");
    const res = await SellerApi.post(
      `/variants/${variantId}/pricing/price`,
      data
    );
    return res.data;
  },

  setVariantDiscount: async (variantId, data) => {
    if (!variantId) throw new Error("variantId is required");
    const res = await SellerApi.post(
      `/variants/${variantId}/pricing/discount`,
      data
    );
    return res.data;
  },

  // FEATURES
  saveFeatures: async (productId, features) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(`/products/${productId}/features`, features);
    return res.data;
  },

  // SPECIFICATIONS
  saveSpecifications: async (productId, specifications) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(
      `/products/${productId}/specifications/bulk`,
      specifications
    );
    return res.data;
  },

  getSpecifications: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/specifications`);
    return res.data;
  },

  // MANUFACTURER INFO
  saveManufacturerInfo: async (productId, manufacturer) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(`/products/${productId}/manufacturer`, { manufacturer });
    return res.data;
  },
};

export default sellerApi;
