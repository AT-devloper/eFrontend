import React, { useState, useEffect } from "react";
import sellerApi from "../../api/sellerApi";

const PricingStep = ({ state, dispatch }) => {
  const [pricingData, setPricingData] = useState(
    state.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      mrp: v.price?.mrp || 0,
      discountType: v.discount?.discountType || "PERCENT",
      discountValue: v.discount?.discountValue || 0,
      sellingPrice: v.price?.sellingPrice || 0,
    }))
  );

  // Auto-calculate selling price whenever MRP or discount changes
  useEffect(() => {
    setPricingData((prev) =>
      prev.map((v) => {
        let sp = Number(v.mrp) || 0;
        const discount = Number(v.discountValue) || 0;

        if (v.discountType === "PERCENT") {
          sp = sp - (sp * discount) / 100;
        } else if (v.discountType === "FIXED") {
          sp = sp - discount;
        }

        if (sp < 0) sp = 0;

        return { ...v, sellingPrice: sp.toFixed(2) };
      })
    );
  }, [pricingData.map((v) => `${v.mrp}-${v.discountType}-${v.discountValue}`).join()]);

  const handleChange = (variantId, field, value) => {
    setPricingData((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, [field]: field === "discountValue" || field === "mrp" ? Number(value) : value }
          : v
      )
    );
  };

  const savePricing = async () => {
    for (const v of pricingData) {
      try {
        await sellerApi.setVariantPrice(v.id, {
          mrp: Number(v.mrp),
          sellingPrice: Number(v.sellingPrice),
        });
        await sellerApi.setVariantDiscount(v.id, {
          discountType: v.discountType,
          discountValue: Number(v.discountValue),
        });
      } catch (err) {
        console.error(`Failed for SKU ${v.sku}`, err.response || err);
        alert(`Failed to save pricing for ${v.sku}`);
      }
    }
    alert("Pricing saved successfully!");
    // Update parent state so goNext has correct data
    dispatch({
      variants: pricingData.map((v) => ({
        ...state.variants.find((orig) => orig.id === v.id),
        price: { mrp: v.mrp, sellingPrice: v.sellingPrice },
        discount: { discountType: v.discountType, discountValue: v.discountValue },
      })),
    });
  };

  return (
    <div>
      <h5>Set Pricing</h5>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Cost (MRP)</th>
            <th>Discount Type</th>
            <th>Discount Value</th>
            <th>Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map((v) => (
            <tr key={v.id}>
              <td>{v.sku}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={v.mrp}
                  onChange={(e) => handleChange(v.id, "mrp", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={v.discountType}
                  onChange={(e) => handleChange(v.id, "discountType", e.target.value)}
                >
                  <option value="PERCENT">Percent</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={v.discountValue}
                  onChange={(e) => handleChange(v.id, "discountValue", e.target.value)}
                />
              </td>
              <td>
                <input type="number" value={v.sellingPrice} readOnly />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={savePricing}>Save Pricing</button>
    </div>
  );
};

export default PricingStep;
