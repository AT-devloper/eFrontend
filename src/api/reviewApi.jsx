const BASE_URL = "http://localhost:8080/auth/reviews";

const reviewApi = {
  getReviewsByProduct: async (productId) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product reviews");
      return await res.json();
    } catch (err) {
      console.error("getReviewsByProduct:", err);
      return [];
    }
  },

  createReview: async (reviewData) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return await res.json();
  },

  // 🔥 Added Update Logic
  updateReview: async (reviewId, reviewData) => {
    const res = await fetch(`${BASE_URL}/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to update review");
    return await res.json();
  },

  // 🔥 Added Delete Logic
  deleteReview: async (reviewId) => {
    const res = await fetch(`${BASE_URL}/${reviewId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return true;
  },

  getRatingByProduct: async (productId) => {
    const reviews = await reviewApi.getReviewsByProduct(productId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return { avg: (total / reviews.length).toFixed(1), count: reviews.length };
  },
};

export default reviewApi;