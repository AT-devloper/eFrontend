import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">ELEGANCE</h2>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/products">Collections</Link>
      </div>
    </nav>
  );
}
