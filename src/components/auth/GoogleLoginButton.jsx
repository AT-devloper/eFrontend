import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "./authController";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () =>
      new Promise((resolve, reject) => {
        if (window.google) return resolve();
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("✅ Google Identity Services script loaded");
          resolve();
        };
        script.onerror = (err) => {
          console.error("❌ Failed to load Google script", err);
          reject(err);
        };
        document.body.appendChild(script);
      });

    loadGoogleScript()
      .then(() => {
        if (!window.google) {
          console.error("❌ window.google is undefined after script load");
          return;
        }

        // Initialize Google login
        try {
          window.google.accounts.id.initialize({
            client_id:
              "768380657938-cslmvflgrt2vsbos5nca61dg56g7hiqj.apps.googleusercontent.com",
            callback: handleGoogleLogin,
            ux_mode: "popup",
          });

          const btnContainer = document.getElementById("google-login-btn");
          if (!btnContainer) {
            console.error("❌ Button container not found");
            return;
          }

          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 280,
          });

          // Optional: auto prompt
          window.google.accounts.id.prompt();
        } catch (err) {
          console.error("❌ Error initializing Google login", err);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading Google script", err);
      });
  }, []);

  const handleGoogleLogin = async (response) => {
    console.log("📥 Google login response:", response);

    try {
      if (!response || !response.credential) {
        throw new Error("No Google credential returned");
      }

      const idToken = response.credential;
      console.log("🟢 Google ID token received:", idToken);

      // Send token to backend
      const userData = await authController.googleLogin(idToken);
      console.log("🟢 Backend response:", userData);

      if (!userData || !userData.token || !userData.user) {
        throw new Error("Invalid response from backend");
      }

      // Save user and token
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      setUser(userData.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      alert("Google login failed. Check console for details.");
    }
  };

  return (
    <div
      id="google-login-btn"
      style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
    />
  );
};

export default GoogleLoginButton;