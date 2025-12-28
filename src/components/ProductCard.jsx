import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    name: "Gold Necklace",
    price: "89,999",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d"
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: "1,25,000",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"
  }
];

export default function Products() {
  return (
    <section className="products">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}
