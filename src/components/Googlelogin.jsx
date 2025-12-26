import React, { useEffect, useState } from "react";
import API from "../API/axiosInstance";

const Googlelogin = () => {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById("google-js")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.id = "google-js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initializeGoogle;
      } else initializeGoogle();
    };

    const initializeGoogle = () => {
      /* global google */
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "298560965048-qjp93s81f5m8s3imhhtct536i3gu0pc8.apps.googleusercontent.com", // ⚠️ Replace with your client ID
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
        setToken(res.data);
        localStorage.setItem("token", res.data);
        setMessage("✅ Login/Register successful via Google!");
      } catch (err) {
        setMessage(err.response?.data || "❌ Google login failed");
      }
    };

    loadGoogleScript();
  }, []);

  return (
    <div style={{ width: 400, margin: "auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>Login with Google</h2>
      <div id="google-login-button"></div>
      {message && <p style={{ marginTop: 20, color: token ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default Googlelogin;
