import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import animationData from "../assets/animation.json";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
  <Navbar />

  <main>
    {/* Hero Section */}
    <section className="hero">
      <div className="hero-content" data-aos="fade-right">
        <h1>
          Timeless Elegance <span>Reimagined</span>
        </h1>
        <p>
          Discover exquisite jewelry crafted with tradition and modern luxury.
        </p>
        <button
          className="primary-btn"
          onClick={() => navigate("/products")}
        >
          Explore Collection
        </button>
      </div>

      <div className="hero-animation" data-aos="fade-left">
        <Lottie animationData={animationData} loop />
      </div>
    </section>


   
  </main>

  <Footer />
</>

  );
};

export default Home;
