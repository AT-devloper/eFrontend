import React, { useState, useEffect } from "react";

const VariantStep = ({ state, dispatch }) => {
  const [variants, setVariants] = useState(state.variants || []);

  useEffect(() => {
    dispatch({ variants });
  }, [variants]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: "",
        price: 0,
        stock: 0,
        attributes: { ...state.attributes }, // IDs only
      },
    ]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  return (
    <div>
      <h5>Manage Variants</h5>
      {variants.map((v, idx) => (
        <div key={idx}>
          <input
            placeholder="SKU"
            value={v.sku}
            onChange={(e) => handleChange(idx, "sku", e.target.value)}
          />
          <input
            placeholder="Price"
            type="number"
            value={v.price}
            onChange={(e) =>
              handleChange(idx, "price", parseFloat(e.target.value) || 0)
            }
          />
          <input
            placeholder="Stock"
            type="number"
            value={v.stock}
            onChange={(e) =>
              handleChange(idx, "stock", parseInt(e.target.value) || 0)
            }
          />
        </div>
      ))}
      <button onClick={addVariant}>Add Variant</button>
    </div>
  );
};

export default VariantStep;
