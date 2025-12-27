import React from "react";
import Header from "../components/layout/Header";
import Banner from "../assets/Banner";
import FeaturedProducts from "../components/products/FeaturedProducts";
import Footer from "../components/layout/Footer";

const Home = () => (
  <div>
    <Header />
    <Banner />
    <FeaturedProducts />
    <Footer />
  </div>
);

export default Home;
