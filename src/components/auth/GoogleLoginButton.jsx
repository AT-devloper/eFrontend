import { useEffect } from "react";
import { authController } from "./authController";

const GoogleLoginButton = () => {
  useEffect(() => {
    /* global google */
    if (!window.google) return; // wait for Google script to load

    google.accounts.id.initialize({
      client_id:
        "298560965048-qjp93s81f5m8s3imhhtct536i3gu0pc8.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 280, // ensures it’s wide enough
      }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;
      const jwt = await authController.googleLogin(idToken);
      localStorage.setItem("token", jwt);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed");
    }
  };

  return (
    <div
      id="google-login-btn"
      style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}
    ></div>
  );
};

export default GoogleLoginButton;
