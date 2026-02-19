const BASE_URL = "http://localhost:8080/auth/reviews";

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};

const reviewApi = {
  getReviewsByProduct: async (productId) => {
    const res = await authFetch(`${BASE_URL}/product/${productId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  createReview: async (reviewData) => {
    const res = await authFetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) throw new Error("Failed to submit review");
    return res.json();
  },

  updateReview: async (reviewId, reviewData) => {
    const res = await authFetch(`${BASE_URL}/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) throw new Error("Failed to update review");
    return res.json();
  },

  deleteReview: async (reviewId) => {
    const res = await authFetch(`${BASE_URL}/${reviewId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete review");
    return true;
  },
};

export default reviewApi;
