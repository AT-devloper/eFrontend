import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import GlobalLoader from "./GlobalLoader";// Import the new loader

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <CartProvider>
          {/* Wrap AppRoutes with the GlobalLoader */}
          <GlobalLoader>
            <AppRoutes />
          </GlobalLoader>

          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            style={{ zIndex: 100000 }} // Ensure toast is above the loader if needed
          />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;