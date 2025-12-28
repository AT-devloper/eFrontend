import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  {
    id: 1,
    name: "Royal Gold Necklace",
    price: "₹1,25,000",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e"
  },
  {
    id: 2,
    name: "Diamond Earrings",
    price: "₹85,000",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
  },
  {
    id: 3,
    name: "Bridal Bangle Set",
    price: "₹2,10,000",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231693"
  }
];

const Products = () => {
  return (
    <>
      <Navbar />

      <section className="products-section">
        <h1 className="section-title">Our Collection</h1>

        <div className="product-grid">
          {products.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Products;
