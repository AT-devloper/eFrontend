import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";

const AttributeSelection = ({ state, dispatch }) => {
  const [attributes, setAttributes] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({});

  // Fetch all attributes
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

  // Update state.attributes whenever attributeSets change
  useEffect(() => {
    if (state.attributeSets && state.attributeSets.length > 0) {
      const mergedAttrs = {};
      state.attributeSets.forEach((set) => {
        Object.entries(set).forEach(([attrId, valIds]) => {
          mergedAttrs[attrId] = Array.from(
            new Set([...(mergedAttrs[attrId] || []), ...valIds])
          );
        });
      });
      dispatch({ attributes: mergedAttrs });
    } else {
      dispatch({ attributes: {} });
    }
  }, [state.attributeSets]);

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

    const updatedSets = [...(state.attributeSets || []), currentSelection];
    dispatch({ attributeSets: updatedSets });
    setCurrentSelection({});
  };

  const removeAttributeSet = (index) => {
    const updated = [...state.attributeSets];
    updated.splice(index, 1);
    dispatch({ attributeSets: updated });
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
              const selected = (currentSelection[attr.id] || []).includes(val.id);
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

      {state.attributeSets && state.attributeSets.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Attribute Sets:</strong>
          <ul>
            {state.attributeSets.map((set, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>
                {Object.entries(set)
                  .map(([attrId, valIds]) =>
                    valIds.map((valId) => getValueName(attrId, valId)).join(", ")
                  )
                  .join(" | ")}
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "2px 6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => removeAttributeSet(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttributeSelection;
