import React from "react";

const ProductManufact = ({ state, dispatch }) => {
  return (
    <div>
      <h5>Manufacturer Information</h5>
      <input
        type="text"
        placeholder="Manufacturer Name"
        value={state.manufacturer}
        onChange={(e) => dispatch({ manufacturer: e.target.value })}
      />
    </div>
  );
};

export default ProductManufact;
