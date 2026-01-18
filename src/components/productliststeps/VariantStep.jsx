import React, { useState, useEffect } from "react";
import sellerApi from "../../api/sellerApi";

// Generate SKU from selected attribute values
const generateSKU = (attributes, allAttributes) => {
  const parts = [];
  Object.entries(attributes).forEach(([attrId, valIds]) => {
    const attr = allAttributes.find(a => a.id === parseInt(attrId));
    if (!attr || !Array.isArray(valIds)) return;
    valIds.forEach(valId => {
      const val = attr.values.find(v => v.id === valId);
      if (val) parts.push(val.name.slice(0, 3).toUpperCase());
    });
  });
  return parts.join("-") || `SKU${Math.floor(Math.random() * 1000)}`;
};

const VariantStep = ({ state, dispatch }) => {
  const [variant, setVariant] = useState({ sku: "", stock: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createSKU = async () => {
      if (!state.attributes || !Object.keys(state.attributes).length) return;
      const allAttributes = await sellerApi.getAllAttributes();
      const sku = generateSKU(state.attributes, allAttributes);
      setVariant(prev => ({ ...prev, sku }));
    };
    createSKU();
  }, [state.attributes]);

  const handleChange = e => {
    const { name, value } = e.target;
    setVariant(prev => ({ ...prev, [name]: value }));
  };

  const addVariant = async () => {
  if (!variant.sku) return alert("SKU cannot be empty");
  if (!state.productId) return alert("Complete Product Info first");

  // Transform attributes to object format required by backend
  const attributesObj = {};
  Object.entries(state.attributes).forEach(([attrId, valIds]) => {
    // Assuming one value per attribute for variant creation
    if (Array.isArray(valIds) && valIds.length > 0) {
      attributesObj[attrId] = valIds[0]; // pick first selected value
    }
  });

  if (Object.keys(attributesObj).length === 0)
    return alert("Select at least one attribute for this variant");

  const payload = {
    sku: variant.sku,
    stock: Number(variant.stock) || 0,
    attributes: attributesObj, // ✅ send as object, not array
  };

  setLoading(true);
  try {
    const savedVariant = await sellerApi.createVariant(state.productId, payload);
    dispatch({ variants: [...state.variants, savedVariant] });
    setVariant({ sku: "", stock: "" });
    alert("Variant added successfully!");
  } catch (err) {
    console.error("Error creating variant:", err.response?.data || err);
    alert("Failed to save variant. Check console.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h5>Manage Variants</h5>

      <div>
        <label>SKU (auto-generated)</label>
        <input type="text" value={variant.sku} readOnly />
      </div>

      <div>
        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={variant.stock}
          onChange={handleChange}
          min="0"
        />
      </div>

      <button onClick={addVariant} disabled={loading}>
        {loading ? "Saving..." : "Add Variant"}
      </button>

      <div>
        <h6>Existing Variants:</h6>
        <ul>
          {state.variants.map(v => (
            <li key={v.id || v.sku}>
              {v.sku} — Stock: {v.stock}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VariantStep;
