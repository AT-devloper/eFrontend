import { useEffect, useState } from "react";
import { wishlistApi } from "../api/wishlistApi";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlist();
      setItems(data);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleToggle = async (productId) => {
    try {
      await wishlistApi.toggleWishlist(productId);
      loadWishlist(); // refresh after toggle
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      {items.length === 0 && <p>No items in wishlist.</p>}
      {items.map(item => (
        <div key={item.wishlistId}>
          <img src={item.image} alt={item.productName} width={100} />
          <span>{item.productName}</span>
          <span>₹{item.price?.toFixed(2)}</span>
          <button onClick={() => handleToggle(item.productId)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
