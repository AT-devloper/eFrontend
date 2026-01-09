// src/components/Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ categoryName, productName }) => {
  return (
    <nav className="text-gray-600 text-sm mb-4">
      <ol className="list-reset flex">
        <li>
          <Link to="/" className="hover:text-blue-500">Home</Link>
        </li>
        <li>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-500">Products</Link>
        </li>
        {categoryName && (
          <li>
            <span className="mx-2">/</span>
            <Link to={`/products/${categoryName}`} className="hover:text-blue-500">{categoryName}</Link>
          </li>
        )}
        {productName && (
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-semibold">{productName}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
