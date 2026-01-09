// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col">
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
        <h2 className="mt-2 font-semibold text-lg">{product.name}</h2>
        <p className="text-gray-700 mt-1">${product.price?.toFixed(2) || "N/A"}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
