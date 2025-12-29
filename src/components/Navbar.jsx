import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          AT-LUXE
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Collections</Link>
            </li>
            {/* Login/Register button */}
            <li className="nav-item ms-3">
            <Link
              to="/auth" // route to your AuthToggleCard page
              className="btn btn-nav-auth"
            >
              Login / Register
            </Link>
          </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
