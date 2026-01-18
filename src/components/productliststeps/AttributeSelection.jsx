import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";

const AttributeSelection = ({ state, dispatch, productId }) => {
  const [attributes, setAttributes] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({}); // { attrId: [valId] }

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await sellerApi.getAllAttributes();
        setAttributes(res);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
        alert("Failed to load attributes. Check console.");
      }
    };
    fetchAttributes();
  }, []);

  const handleSelect = (attrId, valId) => {
    setCurrentSelection((prev) => {
      const selected = prev[attrId] || [];
      const newSelected = selected.includes(valId)
        ? selected.filter((id) => id !== valId)
        : [...selected, valId];

      return { ...prev, [attrId]: newSelected };
    });
  };

  const addAttributeSet = () => {
    if (!Object.values(currentSelection).some((arr) => arr.length > 0)) {
      alert("Select at least one attribute");
      return;
    }

    const updatedAttributes = { ...state.attributes };

    Object.entries(currentSelection).forEach(([attrId, valIds]) => {
      if (!updatedAttributes[attrId]) updatedAttributes[attrId] = [];
      updatedAttributes[attrId] = Array.from(
        new Set([...updatedAttributes[attrId], ...valIds])
      );
    });

    dispatch({ attributes: updatedAttributes });
    setCurrentSelection({});
  };

  const removeAttributeValue = (attrId, valId) => {
    const updated = { ...state.attributes };
    updated[attrId] = updated[attrId].filter((id) => id !== valId);
    if (updated[attrId].length === 0) delete updated[attrId];
    dispatch({ attributes: updated });
  };

  const getValueName = (attrId, valId) => {
    const attr = attributes.find((a) => a.id === parseInt(attrId));
    if (!attr) return valId;
    const val = attr.values.find((v) => v.id === valId);
    return val ? val.name : valId;
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {attributes.map((attr) => (
        <div key={attr.id} style={{ marginBottom: "10px" }}>
          <strong>{attr.name}</strong>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "6px" }}>
            {attr.values.map((val) => {
              const selected =
                (currentSelection[attr.id] || []).includes(val.id) ||
                (state.attributes[attr.id] || []).includes(val.id);

              return (
                <button
                  key={`${attr.id}-${val.id}`}
                  type="button"
                  onClick={() => handleSelect(attr.id, val.id)}
                  style={{
                    marginRight: "6px",
                    marginBottom: "6px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: selected ? "2px solid #ffd700" : "1px solid #ccc",
                    backgroundColor: selected ? "#fff8e1" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  {val.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={addAttributeSet} style={{ marginTop: "10px" }}>
        Add Attribute Set
      </button>

      {state.attributes && Object.keys(state.attributes).length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Attributes:</strong>
          <ul>
            {Object.entries(state.attributes).map(([attrId, valIds]) =>
              valIds.map((valId) => (
                <li
                  key={`${attrId}-${valId}`}
                  onClick={() => removeAttributeValue(attrId, valId)}
                  style={{
                    cursor: "pointer",
                    margin: "4px 0",
                    border: "1px solid #ccc",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {getValueName(attrId, valId)} &times;
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttributeSelection;
