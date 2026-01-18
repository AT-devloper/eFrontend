import React, { useState, useEffect } from "react";

const ProductFeatureStep = ({ state, dispatch }) => {
  const featureOptions = ["Handmade", "Hallmarked", "Certified", "Limited Edition", "Adjustable"];
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (state.features && state.features.length) {
      setSelectedFeatures(state.features.map((f) => f.feature));
    }
  }, [state.features]);

  const toggleFeature = (feature) => {
    let updated = [];
    if (selectedFeatures.includes(feature)) {
      updated = selectedFeatures.filter((f) => f !== feature);
    } else {
      updated = [...selectedFeatures, feature];
    }
    setSelectedFeatures(updated);

    // Update parent state
    dispatch({
      features: updated.map((f, idx) => ({
        feature: f,
        productId: state.productId || null,
        id: idx + 1,
      })),
    });
  };

  return (
    <div>
      <h5>Product Features (Jewelry)</h5>
      <div style={{ marginBottom: "10px" }}>
        {featureOptions.map((feature) => (
          <label key={feature} style={{ display: "block", marginBottom: 5 }}>
            <input
              type="checkbox"
              checked={selectedFeatures.includes(feature)}
              onChange={() => toggleFeature(feature)}
            />{" "}
            {feature}
          </label>
        ))}
      </div>

      {selectedFeatures.length === 0 && (
        <p style={{ color: "red" }}>Select at least one feature</p>
      )}
    </div>
  );
};

export default ProductFeatureStep;
