"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface UploadFileProps {
  uploadUrl: string;
  onUploadSuccess: (images: { url: string; public_id: string }[]) => void; // Mengirim array gambar ke parent
}

export default function UploadFile({ uploadUrl, onUploadSuccess }: UploadFileProps) {
  const [loading, setLoading] = useState(false);
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
    Array.from(files).forEach((file) => formData.append("files", file)); // Tambahkan semua file ke FormData

    setLoading(true);
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onUploadSuccess(data.images); // Pass array of images (url & publicId) to parent
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Upload Button */}
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
      >
        <Image src="/images/icon/ic_file.png" alt="File" width={16} height={16} />
        <span>Upload Files</span>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple // Tambahkan atribut multiple untuk mendukung banyak file
        style={{ display: "none" }}
      />

      {/* Loading Indicator */}
      {loading && <p>Uploading...</p>}
    </div>
  );
}