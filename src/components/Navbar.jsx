import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>AT</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/products">Collections</Link>
        <Link to="/">Contact</Link>
        

      </div>
    </nav>
  );
};

export default Navbar;
