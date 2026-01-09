import React, { useState } from "react";

const VariantImageUpload = ({ state, dispatch }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    dispatch({ images: [...state.images, ...e.target.files] });
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple onChange={handleFileChange} />
      {files.length > 0 && (
        <ul className="mt-2">
          {Array.from(files).map((file, idx) => (
            <li key={idx} className="border p-2 rounded mb-1">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VariantImageUpload;
