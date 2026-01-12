import React, { useState, useMemo } from "react";

const ProductFeatureStep = ({ state, dispatch }) => {
  const [features, setFeatures] = useState(
    state.features.length ? state.features : [""]
  );

  const addFeature = () => setFeatures([...features, ""]);

  const updateFeature = (idx, value) => {
    const copy = [...features];
    copy[idx] = value;
    setFeatures(copy);

    // 🔥 update parent immediately
    dispatch({
      features: copy.map(f => f.trim()).filter(Boolean),
    });
  };

  const removeFeature = (idx) => {
    const updated = features.filter((_, i) => i !== idx);
    const safe = updated.length ? updated : [""];

    setFeatures(safe);
    dispatch({
      features: safe.map(f => f.trim()).filter(Boolean),
    });
  };

  const isValid = useMemo(
    () => features.some(f => f.trim() !== ""),
    [features]
  );

  return (
    <div>
      <h5>Product Features</h5>

      {features.map((f, idx) => (
        <div key={idx} style={{ marginBottom: 6 }}>
          <input
            type="text"
            value={f}
            placeholder="Feature"
            onChange={(e) => updateFeature(idx, e.target.value)}
          />
          <button onClick={() => removeFeature(idx)}>Remove</button>
        </div>
      ))}

      <button onClick={addFeature}>Add Feature</button>

      {!isValid && (
        <p style={{ color: "red", marginTop: 5 }}>
          Add at least one feature
        </p>
      )}
    </div>
  );
};

export default ProductFeatureStep;
