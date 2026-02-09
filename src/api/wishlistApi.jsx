// Ensure this matches your Spring Boot port (usually 8080)
const BASE_URL = "http://localhost:8080/auth/wishlist";

const wishlistApi = {
  /**
   * Fetch all wishlist items for a specific user
   * Backend: @GetMapping("/{userId}")
   */
  getWishlist: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // If using JWT later:
          // "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      return []; // Prevent UI crash
    }
  },

  /**
   * Add a product to the wishlist
   * Backend: @PostMapping("/add")
   * Body: { userId, productId }
   */
  addToWishlist: async (userId, productId) => {
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to wishlist");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  /**
   * Remove a product from the wishlist
   * Backend: @DeleteMapping("/remove")
   * Params: ?userId=1&productId=2
   */
  removeFromWishlist: async (userId, productId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/remove?userId=${userId}&productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },
};

export default wishlistApi;
