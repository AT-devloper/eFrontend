import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Timeless Jewellery</h1>
      <p>Crafted for moments that last forever</p>
      <Link to="/products" className="hero-btn">
        Explore Collections
      </Link>
    </section>
  );
}
