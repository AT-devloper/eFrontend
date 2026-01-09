import React from "react";

const ProductInfoStep = ({ state, dispatch }) => {
  return (
    <div>
      <h5>Product Information</h5>
      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          className="form-control"
          value={state.productInfo?.name || ""}
          onChange={(e) =>
            dispatch({
              productInfo: { ...state.productInfo, name: e.target.value },
            })
          }
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          value={state.productInfo?.description || ""}
          onChange={(e) =>
            dispatch({
              productInfo: { ...state.productInfo, description: e.target.value },
            })
          }
        />
      </div>
    </div>
  );
};

export default ProductInfoStep;
