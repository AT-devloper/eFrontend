import React, { useState } from "react";

const ProductSpecificationStep = ({ state, dispatch }) => {
  const [specs, setSpecs] = useState(state.specifications || []);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const handleChange = (idx, field, value) => {
    const updated = [...specs];
    updated[idx][field] = value;
    setSpecs(updated);
  };

  const removeSpec = (idx) => {
    const updated = specs.filter((_, i) => i !== idx);
    setSpecs(updated);
  };

  const saveSpecsToState = () => {
    dispatch({ specifications: specs });
  };

  return (
    <div>
      <h5>Product Specifications</h5>
      {specs.map((spec, idx) => (
        <div key={idx} style={{ marginBottom: "5px" }}>
          <input
            type="text"
            placeholder="Key"
            value={spec.key}
            onChange={(e) => handleChange(idx, "key", e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={spec.value}
            onChange={(e) => handleChange(idx, "value", e.target.value)}
          />
          <button onClick={() => removeSpec(idx)}>Remove</button>
        </div>
      ))}
      <button onClick={addSpec}>Add Specification</button>
      <button onClick={saveSpecsToState}>Save Specifications</button>
    </div>
  );
};

export default ProductSpecificationStep;
