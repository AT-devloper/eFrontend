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

  // Resolve backend image paths
  const resolveImagePath = (path) => {
    if (!path || path === "/placeholder.png" || path === "placeholder.png") return null;
    if (path.startsWith("http")) return path;

    const BASE_URL = "http://localhost:8080";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  // 🔄 FETCH CART (single source of truth)
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
          let image = resolveImagePath(item.image);

          // fallback to seller images
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

  // Initial + user change
  useEffect(() => {
    fetchCart();
  }, [user]);

  // ➕ Add item
  const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    await cartApi.addToCart({ productId, variantId, quantity });
    await fetchCart();
  };

  // ❌ Remove item
  const removeItem = async (cartItemId) => {
    await cartApi.removeItem(cartItemId);
    await fetchCart();
  };

  // 🔁 Update quantity
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

  // 💰 Total
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
        fetchCart, // 🔥 USED AFTER PAYMENT
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
