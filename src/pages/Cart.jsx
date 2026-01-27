import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // ✅ import trash icon

const Cart = () => {
  const { cart, loading, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  if (loading)
    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>
        {[1, 2, 3].map((i) => (
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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cart.map((item) => (
        <div key={item.cartItemId} className="cart-item">
          <img
            src={item.image || "/placeholder.png"}
            alt={item.productName}
            style={{ width: 80, height: 80 }}
          />
          <div className="cart-item-info">
            <p>{item.productName}</p>
            {item.variantId && (
              <p style={{ fontSize: 12 }}>Variant: {item.variantId}</p>
            )}
            <p>₹{item.price.toFixed(2)}</p>
          </div>

          <div className="cart-quantity">
            <button
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item, item.quantity - 1)}
            >
              −
            </button>
            <span className="qty-fade">{item.quantity}</span>
            <button onClick={() => updateQuantity(item, item.quantity + 1)}>
              +
            </button>
          </div>

          <div className="cart-item-total">
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>

          {/* ✅ Remove icon */}
          <div
            className="cart-item-remove"
            onClick={() => removeItem(item.cartItemId)}
            style={{ cursor: "pointer" }}
            title="Remove item"
          >
            <FaTrash color="#6b1f2b" />
          </div>
        </div>
      ))}

      <div className="cart-total">
        <div className="cart-summary-text">
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <p className="free-delivery">Delivery: Free</p>
        </div>

        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
