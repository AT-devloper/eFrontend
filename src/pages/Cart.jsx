import React from "react";
import { useCart } from "../context/CartContext";


const Cart = () => {
  const { cart, loading, removeItem, updateQuantity, totalPrice } = useCart();

  /* iOS-style skeleton while loading */
  if (loading)
    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>

        {[1, 2, 3].map(i => (
          <div key={i} className="cart-item skeleton">
            <div className="skeleton-img" />
            <div className="skeleton-lines">
              <div />
              <div />
            </div>
          </div>
        ))}
      </div>
    );

  if (!cart.length)
    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>
        <p style={{ color: "#6e6e73" }}>Your cart is empty</p>
      </div>
    );

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cart.map(item => (
        <div key={item.cartItemId} className="cart-item">
          {/* Image */}
          <img
            src={item.image || "/placeholder.png"}
            alt={item.productName}
          />

          {/* Info */}
          <div className="cart-item-info">
            <p>{item.productName}</p>
            <p style={{ fontSize: 12, color: "#6e6e73" }}>
              ID: {item.productId}
              {item.variantId && ` | Variant: ${item.variantId}`}
            </p>
            <p style={{ fontSize: 13 }}>
              ₹{item.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity */}
          <div className="cart-quantity">
            <button
              disabled={item.quantity <= 1}
              onClick={() =>
                updateQuantity(item, item.quantity - 1)
              }
            >
              −
            </button>

            <span key={item.quantity} className="qty-fade">
              {item.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(item, item.quantity + 1)
              }
            >
              +
            </button>
          </div>

          {/* Item total */}
          <div className="cart-item-total">
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>

          {/* Remove */}
          <div
            className="cart-item-remove"
            onClick={() => removeItem(item.cartItemId)}
          >
            ✕
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="cart-total">
        <div className="cart-summary-text">
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <p className="free-delivery">Free delivery</p>
        </div>

        <button>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
