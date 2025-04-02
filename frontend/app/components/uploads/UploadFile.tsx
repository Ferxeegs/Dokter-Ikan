"use client";

import { useRef } from "react";
import Image from "next/image";

interface UploadFileProps {
  uploadUrl: string;
  onUploadSuccess: (images: { url: string; public_id: string }[]) => void;
  isLoading: boolean;
  onUploadStart: () => void;
}

export default function UploadFile({ 
  uploadUrl, 
  onUploadSuccess, 
  isLoading, 
  onUploadStart 
}: UploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    // Notify parent that upload is starting
    onUploadStart();
    
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onUploadSuccess(data.images);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images");
    }
  };

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Upload Button */}
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        <Image src="/images/icon/ic_file.png" alt="File" width={16} height={16} />
        <span>{isLoading ? "Uploading..." : "Upload Files"}</span>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
    </div>
  );
}