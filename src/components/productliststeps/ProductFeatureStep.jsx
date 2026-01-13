import React, { useState, useEffect } from "react";

const ProductFeatureStep = ({ state, dispatch }) => {
  // Predefined jewelry features
  const featureOptions = [
    "Handmade",
    "Hallmarked",
    "Certified",
    "Limited Edition",
    "Adjustable",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (state.features && state.features.length) {
      setSelectedFeatures(state.features.map(f => f.feature));
    }
  }, [state.features]);

  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }

    // Immediately update parent
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];

    dispatch({
      features: updated.map((f, idx) => ({
        id: idx + 1,
        productId: state.productId || null,
        feature: f,
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
