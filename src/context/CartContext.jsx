import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { cartApi } from "../api/cartApi"; // Assuming this handles API calls
import sellerApi from "../api/sellerApi";
import { useUser } from "./UserContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Resolve Image Path
  const resolveImagePath = (path) => {
    if (!path || path === "/placeholder.png" || path === "placeholder.png") return null;
    if (path.startsWith("http")) return path;
    const BASE_URL = "http://localhost:8080";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  // 🔄 FETCH CART
  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await cartApi.getCart(); // Fetch raw cart data

      const enrichedCart = await Promise.all(
        data.map(async (item) => {
          let image = resolveImagePath(item.image);

          // Fallback to seller API if image is missing
          if (!image && item.productId) {
            try {
              const images = await sellerApi.getProductImages(item.productId);
              if (images?.length > 0) {
                const img = images[0];
                const path = img.imageUrl || img.imagePath || img;
                image = resolveImagePath(path);
              }
            } catch {
              console.warn(`[Cart] Image missing for product ${item.productId}`);
            }
          }

          return {
            cartItemId: item.cartItemId,
            productId: item.productId,
            variantId: item.variantId,
            variantName: item.variantName || null,
            productName: item.productName || "Unnamed Product",
            image: image || "/placeholder.png",
            price: item.price ?? 0,
            quantity: item.quantity ?? 1,
          };
        })
      );

      setCart(enrichedCart);
    } catch (err) {
      console.error("[Cart] Fetch failed:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ➕ Add Item
  const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    await cartApi.addToCart({ productId, variantId, quantity });
    await fetchCart();
  };

  // ❌ Remove Single Item
  const removeItem = async (cartItemId) => {
    await cartApi.removeItem(cartItemId);
    await fetchCart();
  };

  // 🗑️ NEW: Clear All Items
  const clearCart = async () => {
    setLoading(true);
    try {
      // Option A: If backend has a clear endpoint
      // await cartApi.clearCart(); 

      // Option B: Loop and delete (Universal fallback)
      await Promise.all(cart.map((item) => cartApi.removeItem(item.cartItemId)));
      
      setCart([]); // Update state immediately
    } catch (err) {
      console.error("Failed to clear cart:", err);
    } finally {
      setLoading(false);
      await fetchCart(); // Sync to be sure
    }
  };

  // 🔁 Update Quantity
  const updateQuantity = async (item, newQty) => {
    if (newQty <= 0) {
      await removeItem(item.cartItemId);
      return;
    }
    const diff = newQty - item.quantity;
    if (diff === 0) return;

    await cartApi.addToCart({
      productId: item.productId,
      variantId: item.variantId,
      quantity: diff,
    });
    await fetchCart();
  };

  // 💰 Total Price
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalPrice,
        addToCart,
        removeItem,
        updateQuantity,
        fetchCart,
        clearCart, // <--- Exported here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};