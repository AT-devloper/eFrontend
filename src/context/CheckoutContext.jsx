import { createContext, useContext, useState } from "react";
import { checkoutApi } from "../api/checkoutApi";

const CheckoutContext = createContext();
export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [checkouts, setCheckouts] = useState([]);

  const checkout = async () => {
    setLoading(true);
    try {
      const data = await checkoutApi.checkout();
      setCheckouts(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckouts = async () => {
    const data = await checkoutApi.getCheckouts();
    setCheckouts(data);
  };

  return (
    <CheckoutContext.Provider
      value={{ checkout, fetchCheckouts, checkouts, loading }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
