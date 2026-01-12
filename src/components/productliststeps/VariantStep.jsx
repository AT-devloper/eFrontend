import React, { useState, useEffect } from "react";
import sellerApi from "../../api/sellerApi";

const VariantStep = ({ state, dispatch }) => {
  const [variant, setVariant] = useState({
    sku: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);

  // Auto-generate SKU whenever attributes change
  useEffect(() => {
    const attrs = Object.values(state.attributes || {});
    if (attrs.length > 0) {
      const sku = attrs.join("-").toUpperCase();
      setVariant((prev) => ({ ...prev, sku }));
    } else {
      setVariant((prev) => ({ ...prev, sku: "" }));
    }
  }, [state.attributes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariant((prev) => ({ ...prev, [name]: value }));
  };

  const addVariant = async () => {
    if (!variant.sku) return alert("SKU cannot be empty");

    const tempId = `temp-${Date.now()}`;
    const optimisticVariant = {
      ...variant,
      stock: Number(variant.stock) || 0,
      attributes: state.attributeIds || {}, // numeric IDs for backend
      id: tempId, // temporary ID for optimistic UI
    };

    // Optimistically add to UI
    dispatch({
      ...state,
      variants: [...state.variants, optimisticVariant],
    });

    // Reset form
    setVariant({ sku: "", stock: "" });
    setLoading(true);

    try {
      // Backend payload should not include temp id or price
      const payload = {
        sku: optimisticVariant.sku,
        stock: optimisticVariant.stock,
        attributes: optimisticVariant.attributes,
      };

      const savedVariant = await sellerApi.createVariant(
        state.productId,
        payload
      );

      // Safety check
      if (!savedVariant || !savedVariant.id) {
        throw new Error("Variant not returned from backend correctly");
      }

      // Replace temp variant with saved variant from backend
      dispatch({
        ...state,
        variants: state.variants
          .filter((v) => v.id !== tempId)
          .concat(savedVariant),
      });
    } catch (err) {
      console.error("Error creating variant:", err);
      alert("Failed to save variant. Rolling back changes.");

      // Remove temp variant
      dispatch({
        ...state,
        variants: state.variants.filter((v) => v.id !== tempId),
      });
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
          {state.variants.map((v) => (
            <li key={v.id || v.sku}>
              {v.sku} — Stock: {v.stock}{" "}
              {v.id?.toString().startsWith("temp-") && "(saving...)"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VariantStep;
