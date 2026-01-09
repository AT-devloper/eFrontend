import React, { useEffect, useState } from "react";

const ThumbnailUpload = ({ state, dispatch }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (state.thumbnailFile) {
      setPreview(URL.createObjectURL(state.thumbnailFile));
    }
  }, [state.thumbnailFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({ thumbnailFile: file });
    }
  };

  return (
    <div>
      <h5>Upload Thumbnail</h5>
      {preview && <img src={preview} alt="Thumbnail Preview" width={200} />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ThumbnailUpload;
