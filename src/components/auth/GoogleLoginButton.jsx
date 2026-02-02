import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "./authController";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

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

      // Backend should return { token, user }
      const { token, user } = await authController.googleLogin(idToken);

      if (!token || !user) throw new Error("Google login failed");

      // Store both token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update UserContext immediately
      setUser(user);

      // Redirect to dashboard/home
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed");
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
