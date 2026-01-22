import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { cartApi } from "../api/cartApi";
import sellerApi from "../api/sellerApi"; // ✅ use your SellerApi
import { useUser } from "./UserContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await cartApi.getCart();

    // Enrich cart items with product images if missing
    const enrichedCart = await Promise.all(
      data.map(async (item) => {
        let image = item.image || "/placeholder.png";

        if (!item.image) {
          try {
            const images = await sellerApi.getProductImages(item.productId);
            if (images.length > 0) {
              image = images[0].imageUrl; // pick first image
            }
          } catch (err) {
            console.warn("Failed to fetch image for product", item.productId, err);
          }
        }

        return {
          cartItemId: item.cartItemId,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName || "Unnamed Product",
          image,
          price: item.price || 0,
          quantity: item.quantity || 1,
        };
      })
    );

    setCart(enrichedCart);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    await cartApi.addToCart({ productId, variantId, quantity });
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await cartApi.removeItem(cartItemId);
    await fetchCart();
  };

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

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, loading, totalPrice, addToCart, removeItem, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
