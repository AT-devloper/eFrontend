import React from "react";
import { useWishlist } from "../context/WishListContext";

const WishlistHeart = ({ productId }) => {
  const { wishlist, toggleWishlist } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.productId === productId);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // prevent card click
        toggleWishlist(productId);
      }}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        cursor: "pointer",
        fontSize: 24,
        color: isInWishlist ? "red" : "gray",
        transition: "color 0.2s",
        zIndex: 2,
      }}
      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isInWishlist ? "♥" : "♡"}
    </div>
  );
};

export default WishlistHeart;
