import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext"; // <-- import UserProvider

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppRoutes />

        {/* ✅ Toast container (add once globally) */}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
