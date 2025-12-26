import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

function Login() {
  const [showForgot, setShowForgot] = useState(false);

  return (
    <>
      {!showForgot ? (
        <>
          <h2>Login</h2>
          <input placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button>Login</button>

          <p
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </p>
        </>
      ) : (
        <ForgotPassword onBack={() => setShowForgot(false)} />
      )}
    </>
  );
}

export default Login;
