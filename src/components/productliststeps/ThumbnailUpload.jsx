import React from "react";

const ThumbnailUpload = ({ state, dispatch }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    dispatch({ thumbnailFile: file });
  };

  return (
    <div>
      <h5>Upload Thumbnail</h5>
      <input type="file" accept="image/*" onChange={handleFile} />
      {state.thumbnailFile && (
        <img
          src={URL.createObjectURL(state.thumbnailFile)}
          alt="Thumbnail Preview"
          width={100}
        />
      )}
    </div>
  );
};

export default ThumbnailUpload;
