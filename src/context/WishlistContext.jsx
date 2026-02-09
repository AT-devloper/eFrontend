// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useUser } from "./UserContext";
import wishlistApi from "../api/wishlistApi";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await wishlistApi.getWishlist(user.id);
      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[Wishlist] Fetch error:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId) => {
    if (!user || typeof productId !== "number") return;
    await wishlistApi.addToWishlist(user.id, productId);
    fetchWishlist();
  };

  const removeFromWishlist = async (productId) => {
    if (!user || typeof productId !== "number") return;
    await wishlistApi.removeFromWishlist(user.id, productId);
    fetchWishlist();
  };

  const toggleWishlist = async (productId) => {
    if (typeof productId !== "number") {
      console.error("❌ Wishlist expects productId:number", productId);
      return;
    }

    const exists = wishlist.some((i) => i.productId === productId);
    exists ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  const isInWishlist = useMemo(
    () => (productId) => wishlist.some((i) => i.productId === productId),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
