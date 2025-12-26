import React, { useEffect } from "react";
import API from "../API/axiosInstance";

const GoogleLogin = ({ googleClientId, setToken, setMessage }) => {
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById("google-js")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.id = "google-js";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        document.body.appendChild(script);
      } else initializeGoogle();
    };

    const initializeGoogle = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin,
        });
        google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large", width: 300 }
        );
      }
    };

    const handleGoogleLogin = async (response) => {
      try {
        const res = await API.post("/auth/google", { idToken: response.credential });
        localStorage.setItem("token", res.data);
        setToken(res.data);
        setMessage("✅ Google login successful!");
      } catch (err) {
        setMessage(err.response?.data || "❌ Google login failed");
      }
    };

    loadGoogleScript();
  }, [googleClientId, setToken, setMessage]);

  return (
    <div style={styles.container}>
      <h2>Login with Google</h2>
      <div id="google-login-button"></div>
    </div>
  );
};

const styles = {
  container: { padding: 20, border: "1px solid #ccc", borderRadius: 5 },
};

export default GoogleLogin;
