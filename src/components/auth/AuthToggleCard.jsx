import React, { useState } from "react";
import { Box, Card, Button, Fade, Typography } from "@mui/material";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const AuthToggleCard = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [resetToken, setResetToken] = useState(null);

  const switchToLogin = () => setActiveTab("login");
  const switchToRegister = () => setActiveTab("register");
  const switchToForgot = () => setActiveTab("forgot");
  const switchToReset = (token) => {
    setResetToken(token);
    setActiveTab("reset");
  };

  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 8,
        p: 4,
        borderRadius: 6,
        backgroundColor: "background.paper",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
    >
      {/* Branding inside the card */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: "Playfair Display", fontWeight: 900, color: "primary.main" }}>AT</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "primary.light" }}>Luxe</Typography>
      </Box>

      {/* Modern Pill Toggle */}
      {(activeTab === "login" || activeTab === "register") && (
        <Box
          sx={{
            display: "flex",
            position: "relative",
            backgroundColor: "rgba(0,0,0,0.04)",
            borderRadius: 50,
            p: 0.5,
            mb: 4,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Sliding Background */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: activeTab === "login" ? 4 : "50%",
              width: "calc(50% - 4px)",
              bgcolor: "primary.main",
              borderRadius: 50,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 0,
              boxShadow: "0 4px 12px rgba(74, 46, 46, 0.2)",
            }}
          />
          <Button
            fullWidth
            onClick={switchToLogin}
            sx={{
              borderRadius: 50,
              color: activeTab === "login" ? "#fff" : "text.secondary",
              fontWeight: 700,
              zIndex: 1,
              py: 1,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={switchToRegister}
            sx={{
              borderRadius: 50,
              color: activeTab === "register" ? "#fff" : "text.secondary",
              fontWeight: 700,
              zIndex: 1,
              py: 1,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            Register
          </Button>
        </Box>
      )}

      {/* Forms Container */}
      <Box sx={{ position: "relative" }}>
        <Fade in={activeTab === "login"} unmountOnExit>
          <Box>
            <Login switchToRegister={switchToRegister} switchToForgot={switchToForgot} />
          </Box>
        </Fade>

        <Fade in={activeTab === "register"} unmountOnExit>
          <Box>
            <Register switchToLogin={switchToLogin} />
          </Box>
        </Fade>

        <Fade in={activeTab === "forgot"} unmountOnExit>
          <Box>
            <ForgotPassword switchToLogin={switchToLogin} switchToReset={switchToReset} />
          </Box>
        </Fade>

        <Fade in={activeTab === "reset"} unmountOnExit>
          <Box>
            <ResetPassword token={resetToken} switchToLogin={switchToLogin} />
          </Box>
        </Fade>
      </Box>
    </Card>
  );
};

export default AuthToggleCard;