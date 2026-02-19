import axios from "axios";

// ✅ Axios instance for wishlist API
const WishlistApi = axios.create({
  baseURL: "http://localhost:8080/auth/wishlist", // Match your Spring Boot port
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT to all requests
WishlistApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assumes token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const wishlistApi = {
  /**
   * Fetch all wishlist items for a specific user
   * Backend: @GetMapping("/{userId}")
   */
  getWishlist: async (userId) => {
    if (!userId) throw new Error("User ID is required");
    const res = await WishlistApi.get(`/${userId}`);
    return res.data;
  },

  /**
   * Add a product to the wishlist
   * Backend: @PostMapping("/add")
   * Body: { userId, productId }
   */
  addToWishlist: async (userId, productId) => {
    if (!userId || !productId) throw new Error("User ID and Product ID are required");
    const res = await WishlistApi.post("/add", { userId, productId });
    return res.data;
  },

  /**
   * Remove a product from the wishlist
   * Backend: @DeleteMapping("/remove")
   * Params: ?userId=1&productId=2
   */
  removeFromWishlist: async (userId, productId) => {
    if (!userId || !productId) throw new Error("User ID and Product ID are required");
    await WishlistApi.delete("/remove", { params: { userId, productId } });
    return true;
  },
};

export default wishlistApi;
