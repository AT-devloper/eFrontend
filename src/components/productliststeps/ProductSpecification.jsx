import React, { useState, useEffect } from "react";

const ProductSpecificationStep = ({ state, dispatch }) => {
  // Jewelry-specific specification fields
  const defaultSpecs = [
    { key: "Metal", value: "" },
    { key: "Gemstone", value: "" },
    { key: "Weight (g)", value: "" },
    { key: "Ring Size", value: "" },
    { key: "Dimensions (mm)", value: "" },
  ];

  const [specs, setSpecs] = useState(
    state.specifications.length ? state.specifications : defaultSpecs
  );

  useEffect(() => {
    // Sync with parent state if already saved
    if (state.specifications && state.specifications.length) {
      setSpecs(state.specifications.map(s => ({
        key: s.specKey || "",
        value: s.specValue || ""
      })));
    }
  }, [state.specifications]);

  const handleChange = (idx, field, value) => {
    const updated = [...specs];
    updated[idx][field] = value;
    setSpecs(updated);
    dispatch({
      specifications: updated.map((s, i) => ({
        id: i + 1,
        productId: state.productId || null,
        specKey: s.key,
        specValue: s.value,
      })),
    });
  };

  const addSpec = () => {
    const updated = [...specs, { key: "", value: "" }];
    setSpecs(updated);
    dispatch({
      specifications: updated.map((s, i) => ({
        id: i + 1,
        productId: state.productId || null,
        specKey: s.key,
        specValue: s.value,
      })),
    });
  };

  const removeSpec = (idx) => {
    const updated = specs.filter((_, i) => i !== idx);
    setSpecs(updated);
    dispatch({
      specifications: updated.map((s, i) => ({
        id: i + 1,
        productId: state.productId || null,
        specKey: s.key,
        specValue: s.value,
      })),
    });
  };

  return (
    <div>
      <h5>Product Details (Jewelry)</h5>

      {specs.map((spec, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Specification"
            value={spec.key}
            onChange={(e) => handleChange(idx, "key", e.target.value)}
            style={{ marginRight: 5 }}
          />
          <input
            type="text"
            placeholder="Value"
            value={spec.value}
            onChange={(e) => handleChange(idx, "value", e.target.value)}
            style={{ marginRight: 5 }}
          />
          <button onClick={() => removeSpec(idx)}>Remove</button>
        </div>
      ))}

      <button onClick={addSpec}>Add Another Detail</button>
    </div>
  );
};

export default ProductSpecificationStep;
