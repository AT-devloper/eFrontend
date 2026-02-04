import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { cartApi } from "../api/cartApi";
import sellerApi from "../api/sellerApi";
import { useUser } from "./UserContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Helper to build the correct path for your localhost backend
  const resolveImagePath = (path) => {
    if (!path || path === "/placeholder.png" || path === "placeholder.png") return null;
    if (path.startsWith("http")) return path;
    
    // Most Spring Boot apps serve images from a specific endpoint or static folder
    // Change this to match your actual backend URL (e.g., http://localhost:8080/uploads/)
    const BASE_URL = "http://localhost:8080"; 
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await cartApi.getCart();

      const enrichedCart = await Promise.all(
        data.map(async (item) => {
          // Check if the current image is just the placeholder string from your log
          let currentImage = resolveImagePath(item.image);
          
          // If it's null (meaning it was a placeholder or empty), fetch from Seller API
          if (!currentImage && item.productId) {
            try {
              const imageResponse = await sellerApi.getProductImages(item.productId);
              
              if (imageResponse && imageResponse.length > 0) {
                // Try to find the path in common property names
                const imgObj = imageResponse[0];
                const path = imgObj.imageUrl || imgObj.imagePath || (typeof imgObj === 'string' ? imgObj : null);
                currentImage = resolveImagePath(path);
              }
            } catch (err) {
              console.warn(`[Cart] No real images found for product ${item.productId}`);
            }
          }

          return {
            cartItemId: item.cartItemId,
            productId: item.productId,
            variantId: item.variantId,
            variantName: item.variantName || null,
            productName: item.productName || "Unnamed Product",
            image: currentImage || "/placeholder.png", // Final fallback if all else fails
            price: item.price ?? 0,
            quantity: item.quantity ?? 1,
          };
        })
      );

      setCart(enrichedCart);
    } catch (err) {
      console.error("[Cart] Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    try {
      await cartApi.addToCart({ productId, variantId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("[Cart] Add failed:", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      await fetchCart();
    } catch (err) {
      console.error("[Cart] Remove failed:", err);
    }
  };

  const updateQuantity = async (item, newQty) => {
    if (newQty <= 0) {
      await removeItem(item.cartItemId);
      return;
    }
    const diff = newQty - item.quantity;
    try {
      // Re-using addToCart logic as per your original code
      await cartApi.addToCart({
        productId: item.productId,
        variantId: item.variantId,
        quantity: diff,
      });
      await fetchCart();
    } catch (err) {
      console.error("[Cart] Update failed:", err);
    }
  };

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, loading, totalPrice, addToCart, removeItem, updateQuantity, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};