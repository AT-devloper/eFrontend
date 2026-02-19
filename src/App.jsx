import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";
import GlobalLoader from "./GlobalLoader";

// 1. IMPORT THE GLOBAL BUTTON
import GlobalBackToTop from "./layouts/GlobalBackToTop";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            
            {/* Wrap AppRoutes with the GlobalLoader */}
            <GlobalLoader>
              <AppRoutes />
            </GlobalLoader>

            {/* 2. ADD THE BUTTON HERE (So it appears on all pages) */}
            <GlobalBackToTop />

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              style={{ zIndex: 100000 }}
            />
            
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;