import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "./authController";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise((resolve) => {
        if (window.google) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initializeGoogle = () => {
      window.google.accounts.id.initialize({
        client_id:
          "298560965048-qjp93s81f5m8s3imhhtct536i3gu0pc8.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        }
      );

      window.google.accounts.id.prompt();
    };

    loadGoogleScript().then(initializeGoogle);
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;

      // Call your Spring Boot backend
      const { token, user } = await authController.googleLogin(idToken);

      if (!token || !user) throw new Error("Google login failed");

      // Save JWT and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update UserContext
      setUser(user);

      // Redirect to dashboard/home
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div
      id="google-login-btn"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    ></div>
  );
};

export default GoogleLoginButton;
