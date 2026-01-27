export const createOrder = async (amount, userId) => {
  const res = await fetch("http://localhost:8080/auth/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, userId }),
  });

  if (!res.ok) throw new Error("Failed to create order");
  return await res.json();
};

export const createSubscription = async (userId) => {
  const res = await fetch("http://localhost:8080/auth/payment/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) throw new Error("Failed to create subscription");
  return await res.json();
};
