import React, { useState, useEffect } from "react";
import sellerApi from "../../api/sellerApi";

// Generate SKU
const generateSKU = (attributes, allAttributes) => {
  const parts = [];
  Object.entries(attributes).forEach(([attrId, valId]) => {
    const attr = allAttributes.find((a) => a.id === parseInt(attrId));
    if (!attr) return;
    const val = attr.values.find((v) => v.id === valId);
    if (!val) return;

    if (attr.name.toLowerCase() === "metal") parts.push(val.name.slice(0, 3).toUpperCase());
    else if (attr.name.toLowerCase() === "purity") parts.push(val.name.replace("Kt", ""));
    else if (attr.name.toLowerCase() === "size") parts.push(val.name);
    else parts.push(val.name.slice(0, 3).toUpperCase());
  });
  return parts.join("-") || `SKU${Math.floor(Math.random() * 1000)}`;
};

// Cartesian product of attribute values
const generateCombinations = (attrSet) => {
  const entries = Object.entries(attrSet);
  if (!entries.length) return [];
  let combos = entries[0][1].map((val) => ({ [entries[0][0]]: val }));

  for (let i = 1; i < entries.length; i++) {
    const [attrId, valIds] = entries[i];
    const newCombos = [];
    combos.forEach((combo) => {
      valIds.forEach((valId) => newCombos.push({ ...combo, [attrId]: valId }));
    });
    combos = newCombos;
  }
  return combos;
};

const VariantStep = ({ state, dispatch }) => {
  const [stock, setStock] = useState("");
  const [allAttributes, setAllAttributes] = useState([]);
  const [previewSKUs, setPreviewSKUs] = useState([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attrs = await sellerApi.getAllAttributes();
        setAllAttributes(attrs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttributes();
  }, []);

  // Generate SKU previews
  useEffect(() => {
    if (!state.attributeSets || !state.attributeSets.length) {
      setPreviewSKUs([]);
      return;
    }

    const previews = [];
    state.attributeSets.forEach((set) => {
      const combos = generateCombinations(set);
      combos.forEach((combo) => {
        previews.push({ combo, sku: generateSKU(combo, allAttributes) });
      });
    });
    setPreviewSKUs(previews);
  }, [state.attributeSets, allAttributes]);

  const addVariants = async () => {
    if (!state.productId) return alert("Complete Product Info first");
    if (!previewSKUs.length) return alert("Select at least one attribute set");

    try {
      const savedVariants = [];
      for (const item of previewSKUs) {
        const payload = { sku: item.sku, stock: Number(stock) || 0, attributes: item.combo };
        const savedVariant = await sellerApi.createVariant(state.productId, payload);
        savedVariants.push(savedVariant);
      }

      dispatch({ variants: [...state.variants, ...savedVariants] });
      setStock("");
      alert("Variants added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save variants. Check console.");
    }
  };

  return (
    <div>
      <h5>Manage Variants</h5>

      <div style={{ marginBottom: "10px" }}>
        <label>Stock (applied to all variants)</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
        />
      </div>

      <button onClick={addVariants}>Add Variants</button>

      <div style={{ marginTop: "15px" }}>
        <h6>SKU Preview:</h6>
        {previewSKUs.length === 0 ? (
          <p>No variants yet.</p>
        ) : (
          <ul>
            {previewSKUs.map((item, idx) => (
              <li key={idx}>{item.sku}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "15px" }}>
        <h6>Existing Variants:</h6>
        {state.variants.length === 0 ? (
          <p>No variants added yet.</p>
        ) : (
          <ul>
            {state.variants.map((v) => (
              <li key={v.id || v.sku}>
                {v.sku} — Stock: {v.stock}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VariantStep;
