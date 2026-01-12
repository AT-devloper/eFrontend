// CategoryStep.jsx
import React, { useState, useEffect } from "react";

const CategoryStep = ({ state, dispatch }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Static categories for development/testing
    setCategories([
      { id: 1, name: "Rings" },
      { id: 2, name: "Necklaces" },
      { id: 3, name: "Bracelets" },
      { id: 4, name: "Earrings" },
    ]);
  }, []);

  const handleSelect = (id) => {
    dispatch({ categoryId: id });
  };

  return (
    <div className="seller-card">
      <h5 className="text-gold">Select Category</h5>

      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className={`category-btn ${
              state.categoryId === cat.id ? "selected" : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {state.categoryId && (
        <p className="mt-2">
          Selected Category ID: <strong>{state.categoryId}</strong>
        </p>
      )}
    </div>
  );
};

export default CategoryStep;
