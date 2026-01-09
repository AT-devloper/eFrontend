import React, { useEffect, useState } from "react";

const ProductSpecification = ({ state, dispatch }) => {
  const [specs, setSpecs] = useState(state.specifications || []);

  useEffect(() => {
    dispatch({ specifications: specs });
  }, [specs]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const handleChange = (idx, field, value) => {
    const updated = [...specs];
    updated[idx][field] = value;
    setSpecs(updated);
  };
  const removeSpec = (idx) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h5>Product Specifications</h5>
      {specs.map((s, idx) => (
        <div key={idx} style={{ marginBottom: "5px" }}>
          <input
            placeholder="Key"
            value={s.key}
            onChange={e => handleChange(idx, "key", e.target.value)}
          />
          <input
            placeholder="Value"
            value={s.value}
            onChange={e => handleChange(idx, "value", e.target.value)}
          />
          <button onClick={() => removeSpec(idx)}>Remove</button>
        </div>
      ))}
      <button onClick={addSpec}>Add Specification</button>
    </div>
  );
};

export default ProductSpecification;
