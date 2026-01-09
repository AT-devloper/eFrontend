import React from "react";

const GalleryUpload = ({ state, dispatch }) => {
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    dispatch({ images: files });
  };

  return (
    <div>
      <h5>Upload Gallery Images</h5>
      <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
      {state.images && state.images.length > 0 && (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {state.images.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="Gallery"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
