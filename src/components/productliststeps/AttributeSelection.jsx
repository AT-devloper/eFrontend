import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";

const AttributeSelection = ({ state, dispatch }) => {
  const [attributes, setAttributes] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({});

  useEffect(() => {
    const fetchAttributes = async () => {
      const res = await sellerApi.getAllAttributes();
      setAttributes(res);
    };
    fetchAttributes();
  }, []);

  const handleSelect = (attrId, value) => {
    setCurrentSelection(prev => ({
      ...prev,
      [attrId]: prev[attrId] === value ? null : value
    }));
  };

  const addAttributeSet = () => {
    if (!Object.values(currentSelection).some(v => v)) {
      alert("Select at least one attribute");
      return;
    }
    dispatch({ attributes: { ...state.attributes, ...currentSelection } });
    setCurrentSelection({});
  };

  const removeAttribute = attrId => {
    const updated = { ...state.attributes };
    delete updated[attrId];
    dispatch({ attributes: updated });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {attributes.map(attr => (
        <div key={attr.id} style={{ marginBottom: "10px" }}>
          <strong>{attr.name}</strong>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "6px" }}>
            {attr.values.map(val => {
              const selected = currentSelection[attr.id] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelect(attr.id, val)}
                  style={{
                    marginRight: "6px",
                    marginBottom: "6px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: selected ? "2px solid #ffd700" : "1px solid #ccc",
                    backgroundColor: selected ? "#fff8e1" : "#fff",
                    cursor: "pointer"
                  }}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={addAttributeSet} style={{ marginTop: "10px" }}>Add Attribute Set</button>

      {state.attributes && Object.keys(state.attributes).length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Attributes:</strong>
          <ul>
            {Object.entries(state.attributes).map(([id, val]) => (
              <li
                key={id}
                onClick={() => removeAttribute(id)}
                style={{ cursor: "pointer", margin: "4px 0", border: "1px solid #ccc", padding: "4px" }}
              >
                {val} &times;
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttributeSelection;
