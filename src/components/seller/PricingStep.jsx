import React, { useEffect, useState } from "react";

const PricingStep = ({ state, dispatch }) => {
  const [variants, setVariants] = useState(
    (state.variants || []).map((v) => ({
      sku: v.sku || "",
      price: { mrp: v.price?.mrp || 0, sellingPrice: v.price?.sellingPrice || 0 },
      discount: {
        discountType: v.discount?.discountType || "",
        discountValue: v.discount?.discountValue || 0,
      },
    }))
  );

  useEffect(() => {
    dispatch({ variants });
  }, [variants]);

  const handleChange = (idx, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      if (!updated[idx].price) updated[idx].price = { mrp: 0, sellingPrice: 0 };
      if (!updated[idx].discount) updated[idx].discount = { discountType: "", discountValue: 0 };

      if (field === "mrp" || field === "sellingPrice") updated[idx].price[field] = value;
      else if (field === "discountType" || field === "discountValue") updated[idx].discount[field] = value;

      return updated;
    });
  };

  return (
    <div>
      <h5>Set Variant Pricing & Discounts</h5>
      {variants.map((v, idx) => (
        <div
          key={idx}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <strong>SKU: {v.sku || "(unsaved)"}</strong>
          <div>
            <label>MRP: </label>
            <input
              type="number"
              value={v.price?.mrp || 0}
              onChange={(e) => handleChange(idx, "mrp", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label>Selling Price: </label>
            <input
              type="number"
              value={v.price?.sellingPrice || 0}
              onChange={(e) => handleChange(idx, "sellingPrice", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label>Discount Type: </label>
            <select
              value={v.discount?.discountType || ""}
              onChange={(e) => handleChange(idx, "discountType", e.target.value)}
            >
              <option value="">None</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>
          <div>
            <label>Discount Value: </label>
            <input
              type="number"
              value={v.discount?.discountValue || 0}
              onChange={(e) => handleChange(idx, "discountValue", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingStep;
