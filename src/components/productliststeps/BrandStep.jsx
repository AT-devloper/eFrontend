import React, { useEffect, useState } from "react";
import sellerApi from "../../api/sellerApi";

const BrandStep = ({ state, dispatch }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await sellerApi.getAllBrands();
        setBrands(response.data || response); // works if API returns array
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  const handleSelect = (id) => {
    dispatch({ brandId: id });
  };

  if (!brands || brands.length === 0) return <p>Loading brands...</p>;

  return (
    <div className="seller-card">
      <h5 className="text-gold">Select Brand</h5>

      <div className="brand-list" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => handleSelect(brand.id)}
            className={`brand-btn ${state.brandId === brand.id ? "selected" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 12px",
              border: state.brandId === brand.id ? "2px solid #cfa32c" : "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#fff",
              cursor: "pointer",
              minWidth: 100,
            }}
          >
            <img
              src={brand.logo_url}
              alt={brand.name}
              style={{ width: 50, height: 50, marginBottom: 6 }}
            />
            <span>{brand.name}</span>
          </button>
        ))}
      </div>

      {state.brandId && (
        <p className="mt-2">
          Selected Brand:{" "}
          <strong>{brands.find((b) => b.id === state.brandId)?.name}</strong>
        </p>
      )}
    </div>
  );
};

export default BrandStep;
