// components/PhotoUpload.js

import { useRef, useState } from 'react';

const PhotoUpload = ({bookImage}) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // const handleUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    bookImage(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      
      <div className="flex flex-col items-start space-y-4">
        {/* <div
          className="flex items-center justify-center py-2 bg-blue-500 text-white rounded-[2vw] cursor-pointer"
          onClick={handleUploadClick}
        >
          Upload
        </div> */}
        <div>Uplaod Book's Photo</div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="h-[22vw] w-[18vw] rounded-[1.5vw] overflow-hidden hover:shadow-xl hover:scale-105">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
            Preview Image
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
