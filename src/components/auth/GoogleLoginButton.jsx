import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { authController } from "./authController";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

useEffect(() => {
  const loadGoogleScript = () =>
    new Promise((resolve) => {
      if (window.google) return resolve();
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });

  loadGoogleScript().then(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
  client_id: "298560965048-qjp93s81f5m8s3imhhtct536i3gu0pc8.apps.googleusercontent.com",
  callback: handleGoogleLogin,
  ux_mode: "popup", // don't use redirect
});


    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 280 }
    );

    window.google.accounts.id.prompt(); // optional
  });
}, []);


  // 3️⃣ Handle Google login response
  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) {
        throw new Error("No Google credential returned");
      }

      const idToken = response.credential;

      // Send token to backend in the expected format
      const userData = await authController.googleLogin(idToken);

      // Save JWT and user locally
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      setUser(userData.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Check console for details.");
    }
  };

  return (
    <div
      id="google-login-btn"
      style={{ display: "flex", justifyContent: "center" }}
    />
  );
};

export default GoogleLoginButton;
