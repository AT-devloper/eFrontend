import React, { useState } from "react";

const GalleryUpload = ({ state, dispatch }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    dispatch({ images: files });
  };

  return (
    <div>
      <h5>Gallery Upload</h5>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
        {state.images?.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} alt="Gallery" width={60} />
        ))}
      </div>
    </div>
  );
};

export default GalleryUpload;
