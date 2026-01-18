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
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================
// SELLER API METHODS
// ===========================
const sellerApi = {
  // =====================
  // BRANDS
  // =====================
  getAllBrands: async () => {
    const res = await SellerApi.get("/brands");
    return res.data;
  },

  // =====================
  // ATTRIBUTES
  // =====================
 getAllAttributes: async () => {
  const res = await SellerApi.get("/attributes");

  // Transform backend data safely
  return (res.data || []).map((attr) => ({
    id: attr.id ?? Math.random(), // fallback unique id
    name: attr.name ?? "Unknown Attribute",
    values: (attr.values || []).map((val, index) => ({
      id: val.id ?? index,           // fallback id
      name: val.value ?? val ?? "Unknown Value", // fallback name
    })),
  }));
},

  saveAttributes: async (productId, attributes) => {
    if (!productId) throw new Error("productId is required");

    /**
     * attributes = [
     *  { attributeId: 1, valueId: 3 },
     *  { attributeId: 2, valueId: 6 }
     * ]
     */
    const res = await SellerApi.post(
      `/products/${productId}/attributes`,
      attributes
    );
    return res.data;
  },

  // =====================
  // PRODUCTS
  // =====================
  createProduct: async (data) => {
    const res = await SellerApi.post("/products", data);
    return res.data;
  },

  getProductListing: async () => {
    const res = await SellerApi.get("/products/page");
    return res.data;
  },

  getProductPage: async (productId) => {
    if (!productId) throw new Error("productId required");
    const res = await SellerApi.get(`/products/page/${productId}/page`);
    return res.data;
  },

  // =====================
  // PRODUCT IMAGES
  // =====================
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

  getProductImages: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/images`);
    return res.data;
  },

  // =====================
  // VARIANTS
  // =====================
// =====================
// VARIANTS
// =====================
// Create a variant for a product
createVariant: async (productId, data) => {
  if (!productId) throw new Error("productId is required");

  if (!data || !data.attributes || typeof data.attributes !== "object") {
    throw new Error(
      "Variant payload must include 'attributes' as an object { attributeId: valueId }"
    );
  }

  // Ensure all IDs are numbers
  const attributesObj = {};
  Object.entries(data.attributes).forEach(([attrId, valId]) => {
    attributesObj[Number(attrId)] = Number(valId);
  });

  const payload = {
    ...data,
    attributes: attributesObj,
    stock: Number(data.stock) || 0,
    sku: data.sku || `SKU${Math.floor(Math.random() * 10000)}`,
  };

  const res = await SellerApi.post(`/products/${productId}/variants`, payload);
  return res.data;
},




  getVariants: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/variants`);
    return res.data;
  },

  // =====================
  // VARIANT PRICING
  // =====================
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

  // =====================
  // FEATURES
  // =====================
saveFeatures: async (productId, features) => {
  if (!productId) throw new Error("productId is required");

  const payload = features.map(f =>
    typeof f === "string" ? f : f.feature
  );

  const res = await SellerApi.post(
    `/products/${productId}/features`,
    payload
  );
  return res.data;
},


  // =====================
  // SPECIFICATIONS
  // =====================
  saveSpecifications: async (productId, specs) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(
      `/products/${productId}/specifications/bulk`,
      specs
    );
    return res.data;
  },

  getSpecifications: async (productId) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.get(`/products/${productId}/specifications`);
    return res.data;
  },

  // =====================
  // MANUFACTURER INFO
  // =====================
  saveManufacturerInfo: async (productId, content) => {
    if (!productId) throw new Error("productId is required");
    const res = await SellerApi.post(
      `/products/${productId}/manufacturer`,
      content
    );
    return res.data;
  },


  selectVariant: async (productId, attributes) => {
  if (!productId) throw new Error("productId is required");

  /**
   * attributes = {
   *   attributeId1: valueId1,
   *   attributeId2: valueId2,
   *   ...
   * }
   */
  const payload = { attributes };
  const res = await SellerApi.post(
    `/products/${productId}/variants/select`,
    payload
  );
  return res.data; // { variantId, price, stock }
},
};

export default sellerApi;
