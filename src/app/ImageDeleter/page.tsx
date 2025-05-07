"use client";

import { useState } from "react";

const ImageDeleter = () => {
  const [fileId, setFileId] = useState<string>("");

  const deleteImage = async () => {
    const res = await fetch("/api/delete-image", {
      method: "DELETE",
      body: JSON.stringify({ fileId }),
    });

    const data = await res.json();
    console.log("Image deleted", data);
  };

  return (
    <div>
      <input
        type="text"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        placeholder="Enter file ID"
      />
      <button onClick={deleteImage}>Delete Image</button>
    </div>
  );
};

export default ImageDeleter;