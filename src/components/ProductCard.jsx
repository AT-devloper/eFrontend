import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="card h-100 text-center">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="price">₹ {product.price}</p>
        <a href="#" className="btn btn-buy mt-auto">
          Buy
        </a>
      </div>
    </div>
  );
}
