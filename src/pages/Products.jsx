import React from "react";
import ProductCard from "../components/ProductCard"; // make sure the path is correct

// Define the products array here
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
  },
  {
    id: 3,
    name: "Bridal Kundan Set",
    price: "3,45,000",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
  },
  {
    id: 4,
    name: "Gold Bangles",
    price: "75,000",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14d1c49"
  },
  {
    id: 5,
    name: "Diamond Earrings",
    price: "1,50,000",
    image: "https://images.unsplash.com/photo-1616990730680-6b94519a8ba6"
  },
  {
    id: 6,
    name: "Pearl Necklace",
    price: "95,000",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d"
  }
];

export default function Products() {
  return (
    <div className="container py-5"  >
      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
