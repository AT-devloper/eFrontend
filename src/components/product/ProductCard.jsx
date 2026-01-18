import React from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/dxwuv127h/image/upload/v1/placeholder.png";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.image && product.image.startsWith("http")
      ? product.image
      : PLACEHOLDER_IMAGE;

  return (
    <Link to={`/products/${product.productId}`}>
      <div className="border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        <h2 className="mt-2 font-semibold text-lg">
          {product.name || "Unnamed Product"}
        </h2>

        <p className="text-gray-700 mt-1">
          ₹{product.price ? product.price.toFixed(2) : "0.00"}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
