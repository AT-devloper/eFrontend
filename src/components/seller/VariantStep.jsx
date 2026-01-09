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
        attributes: { ...state.attributes },
        images: [], // Store files here
        previews: [], // Store preview URLs
      },
    ]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  const handleImageChange = (idx, files) => {
    const updated = [...variants];
    updated[idx].images = files;
    updated[idx].previews = files.map((file) => URL.createObjectURL(file));
    setVariants(updated);
  };

  return (
    <div>
      <h5>Manage Variants</h5>
      {variants.map((v, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
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

          {/* Image upload for this variant */}
          <div style={{ marginTop: "5px" }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(idx, Array.from(e.target.files))}
            />
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              {v.previews?.map((src, i) => (
                <img key={i} src={src} alt="preview" width={60} />
              ))}
            </div>
          </div>
        </div>
      ))}
      <button onClick={addVariant}>Add Variant</button>
    </div>
  );
};

export default VariantStep;
