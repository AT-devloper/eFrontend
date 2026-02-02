import React, { useState } from "react";
import { Box, Card, Button, Fade } from "@mui/material";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const AuthToggleCard = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register' | 'forgot' | 'reset'
  const [resetToken, setResetToken] = useState(null); // For ResetPassword page

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
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: 3,
      }}
    >
      {/* Only show toggle buttons for login/register */}
      {(activeTab === "login" || activeTab === "register") && (
        <Box
          sx={{
            display: "flex",
            position: "relative",
            backgroundColor: "#f0f0f0",
            borderRadius: 50,
            overflow: "hidden",
            mb: 3,
            border: "1px solid #ddd",
          }}
        >
          <Button
            fullWidth
            onClick={switchToLogin}
            sx={{
              color: activeTab === "login" ? "#fff" : "text.primary",
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={switchToRegister}
            sx={{
              color: activeTab === "register" ? "#fff" : "text.primary",
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            Register
          </Button>

          {/* Sliding Indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: activeTab === "login" ? 0 : "50%",
              width: "50%",
              height: "100%",
              bgcolor: "primary.main",
              borderRadius: "50px",
              transition: "left 0.3s ease",
              zIndex: 0,
            }}
          />
        </Box>
      )}

      {/* Forms */}
      <Box sx={{ position: "relative", minHeight: 350 }}>
        {/* Login */}
        <Fade in={activeTab === "login"} unmountOnExit>
          <Box sx={{ position: activeTab === "login" ? "relative" : "absolute", width: "100%" }}>
            <Login switchToRegister={switchToRegister} switchToForgot={switchToForgot} />
          </Box>
        </Fade>

        {/* Register */}
        <Fade in={activeTab === "register"} unmountOnExit>
          <Box sx={{ position: activeTab === "register" ? "relative" : "absolute", width: "100%" }}>
            <Register switchToLogin={switchToLogin} />
          </Box>
        </Fade>

        {/* Forgot Password */}
        <Fade in={activeTab === "forgot"} unmountOnExit>
          <Box sx={{ position: activeTab === "forgot" ? "relative" : "absolute", width: "100%" }}>
            <ForgotPassword switchToLogin={switchToLogin} switchToReset={switchToReset} />
          </Box>
        </Fade>

        {/* Reset Password */}
        <Fade in={activeTab === "reset"} unmountOnExit>
          <Box sx={{ position: activeTab === "reset" ? "relative" : "absolute", width: "100%" }}>
            <ResetPassword token={resetToken} switchToLogin={switchToLogin} />
          </Box>
        </Fade>
      </Box>
    </Card>
  );
};

export default AuthToggleCard;
