import React, { useEffect, useState } from "react";

const GalleryUpload = ({ state, dispatch }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (state.images.length > 0) {
      setPreviews(state.images.map((file) => URL.createObjectURL(file)));
    }
  }, [state.images]);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      dispatch({ images: selectedFiles });
    }
  };

  return (
    <div>
      <h5>Upload Gallery Images</h5>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {previews.map((src, idx) => (
          <img key={idx} src={src} alt="preview" width={100} />
        ))}
      </div>
      <input type="file" multiple accept="image/*" onChange={handleFilesChange} />
    </div>
  );
};

export default GalleryUpload;
