import React, { useState, useEffect } from "react";

const ProductFeatureStep = ({ state, dispatch }) => {
  const [features, setFeatures] = useState(state.features || []);

  useEffect(() => {
    dispatch({ features });
  }, [features]);

  const addFeature = () => setFeatures([...features, ""]);
  const handleChange = (idx, value) => {
    const updated = [...features];
    updated[idx] = value;
    setFeatures(updated);
  };
  const removeFeature = (idx) => {
    const updated = features.filter((_, i) => i !== idx);
    setFeatures(updated);
  };

  return (
    <div>
      <h5>Product Features</h5>
      {features.map((f, idx) => (
        <div key={idx} style={{ marginBottom: "5px" }}>
          <input
            type="text"
            value={f}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder="Feature"
          />
          <button onClick={() => removeFeature(idx)}>Remove</button>
        </div>
      ))}
      <button onClick={addFeature}>Add Feature</button>
    </div>
  );
};

export default ProductFeatureStep;
