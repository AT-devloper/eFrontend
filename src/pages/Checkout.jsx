import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { createOrder, createSubscription } from "../api/paymentApi";

const Checkout = () => {
  const { cart, totalPrice, removeItem } = useCart();
  const [items, setItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState(""); // New: status for UI
  const userId = 1; // Example user ID

  useEffect(() => setItems(cart), [cart]);

  // ===================== ONE-TIME PAYMENT =====================
  const handlePayNow = async () => {
    try {
      setStatusMessage("📝 Creating order...");
      console.log("📝 Creating order...");

      const { orderId, key, amount } = await createOrder(totalPrice * 100, userId);
      setStatusMessage(`✅ Order Created: ${orderId}`);
      console.log(`✅ Order Created: ${orderId}`);

      const testAmount = 36 * 100;
      const payAmount = amount * 100 > testAmount ? testAmount : amount * 100;

      const options = {
        key,
        amount: payAmount,
        currency: "INR",
        name: "AT_LUXE",
        description: "Purchase Jewelry",
        order_id: orderId,
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#528FF0" },
        handler: async function () {
          setStatusMessage("💳 Payment processed. Verifying backend...");
          console.log("💳 Payment processed. Verifying backend...");

          let retries = 0;
          const maxRetries = 10;

          const interval = setInterval(async () => {
            retries++;
            try {
              const res = await fetch(
                `http://localhost:8080/auth/payment/status/check/${orderId}`
              );
              const data = await res.json();

              if (data.status === "DUE") {
                setStatusMessage(`⏳ Order Pending... (Attempt ${retries})`);
                console.log(`⏳ Order Pending... (Attempt ${retries})`);
              } else if (data.status === "PAID") {
                setStatusMessage(`🎉 Order Paid! Payment ID: ${data.razorpayPaymentId}`);
                console.log(`🎉 Order Paid! Payment ID: ${data.razorpayPaymentId}`);
                clearInterval(interval);
              } else {
                setStatusMessage(`⚠️ Unknown status: ${data.status}`);
                console.log(`⚠️ Unknown status: ${data.status}`);
              }

              if (retries >= maxRetries) {
                setStatusMessage("⚠️ Max retries reached. Order still pending.");
                console.log("⚠️ Max retries reached. Order still pending.");
                clearInterval(interval);
              }
            } catch (err) {
              console.error("Error checking status:", err);
            }
          }, 3000);
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("❌ Error creating order:", err);
      setStatusMessage("❌ Payment could not be completed");
    }
  };

  // ===================== SUBSCRIPTION PAYMENT =====================
  const handlePayMonthly = async () => {
    try {
      setStatusMessage("📝 Creating subscription...");
      console.log("📝 Creating subscription...");

      const { subscriptionId, key } = await createSubscription(userId);
      setStatusMessage(`✅ Subscription Created: ${subscriptionId}`);
      console.log(`✅ Subscription Created: ${subscriptionId}`);

      const options = {
        key,
        subscription_id: subscriptionId,
        name: "AT_LUXE",
        description: "Monthly Subscription",
        theme: { color: "#528FF0" },
        handler: async function () {
          setStatusMessage("💳 Subscription payment processed. Verifying backend...");
          console.log("💳 Subscription payment processed. Verifying backend...");

          let retries = 0;
          const maxRetries = 10;

          const interval = setInterval(async () => {
            retries++;
            try {
              const res = await fetch(
                `http://localhost:8080/auth/payment/status/check/${subscriptionId}`
              );
              const data = await res.json();

              if (data.status === "PENDING") {
                setStatusMessage(`⏳ Subscription Pending... (Attempt ${retries})`);
                console.log(`⏳ Subscription Pending... (Attempt ${retries})`);
              } else if (data.status === "ACTIVE") {
                setStatusMessage("🎉 Subscription Activated!");
                console.log("🎉 Subscription Activated!");
                clearInterval(interval);
              } else if (data.status === "HALTED") {
                setStatusMessage("⚠️ Subscription Halted");
                console.log("⚠️ Subscription Halted");
                clearInterval(interval);
              }

              if (retries >= maxRetries) {
                setStatusMessage("⚠️ Max retries reached. Subscription still pending.");
                console.log("⚠️ Max retries reached. Subscription still pending.");
                clearInterval(interval);
              }
            } catch (err) {
              console.error("Error checking subscription:", err);
            }
          }, 3000);
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("❌ Subscription error:", err);
      setStatusMessage("❌ Subscription could not be completed");
    }
  };

  return (
    <div className="cart-container">
      <h2>Checkout</h2>

      {/* ======= Status Display ======= */}
      {statusMessage && (
        <div style={{ margin: "10px 0", padding: "8px", background: "#f0f0f0", borderRadius: "5px" }}>
          {statusMessage}
        </div>
      )}

      {items.length === 0 && <p>Your cart is empty</p>}

      {items.map((item) => (
        <div key={item.cartItemId} className="cart-item">
          <img
            src={item.image || "/placeholder.png"}
            alt={item.productName}
            width={80}
            height={80}
          />
          <div>
            <p>{item.productName}</p>
            {item.variantId && <p>Variant: {item.variantId}</p>}
            <p>Qty: {item.quantity}</p>
            <p>Price: ₹{item.price.toFixed(2)}</p>
          </div>
          <div>₹{(item.price * item.quantity).toFixed(2)}</div>
          <div onClick={() => removeItem(item.cartItemId)}>
            <FaTrash />
          </div>
        </div>
      ))}

      <hr />
      <p>Total: ₹{totalPrice.toFixed(2)}</p>

      <button onClick={handlePayNow}>Pay Now</button>
      <button onClick={handlePayMonthly}>Pay Monthly</button>
    </div>
  );
};

export default Checkout;
