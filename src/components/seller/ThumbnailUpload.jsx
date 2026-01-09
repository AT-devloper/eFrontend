import React from "react";

const ThumbnailUpload = ({ state, dispatch }) => {
  const handleFileChange = (e) => {
    dispatch({ thumbnailFile: e.target.files[0] });
  };

  return (
    <div>
      <h5>Upload Thumbnail Image</h5>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {state.thumbnailFile && (
        <div>
          <img
            src={URL.createObjectURL(state.thumbnailFile)}
            alt="Thumbnail Preview"
            style={{ width: "150px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ThumbnailUpload;
