import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets default CSS */}
      <UserProvider>
        <CartProvider>
          <AppRoutes />

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
    </ThemeProvider>
  );
}

export default App;
