import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/* 👉 AOS IMPORTS */
import AOS from "aos";
import "aos/dist/aos.css";

/* 👉 AOS INIT (RUNS ONCE) */
AOS.init({
  duration: 900,
  once: true,
  easing: "ease-out-cubic",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
