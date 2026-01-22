import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Handle navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load user from localStorage only
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">AT-LUXE</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/products">Collections</Link></li>

            {user ? (
              <>
                <li className="nav-item ms-3">
                  <span className="nav-link">Hi, {user.username || user.email}</span>
                </li>
                <li className="nav-item ms-3 position-relative">
                  <Link to="/cart" className="btn btn-nav-auth">
                    Cart
                    {cartCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item ms-3">
                  <button onClick={handleLogout} className="btn btn-nav-auth">Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-3">
                <Link to="/auth" className="btn btn-nav-auth">Login / Register</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
