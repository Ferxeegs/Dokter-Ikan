"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface UploadFileProps {
  uploadUrl: string;
  onUploadSuccess: (images: { url: string; public_id: string }[]) => void;
  isLoading: boolean;
  onUploadStart: () => void;
  onUploadEnd: () => void; // Tambahkan prop untuk menghentikan loading
}

export default function UploadFile({
  uploadUrl,
  onUploadSuccess,
  isLoading,
  onUploadStart,
  onUploadEnd // Tambahkan prop untuk menghentikan loading
}: UploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // State untuk modal error

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
        onUploadSuccess(data.data.images);
      } else {
        setShowErrorModal(true); // Tampilkan modal error
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setShowErrorModal(true); // Tampilkan modal error
    } finally {
      onUploadEnd();
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
        <span>{isLoading ? "Loading..." : "Upload File"}</span>
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

      {/* Modal Error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
            <p className="text-sm text-gray-700 mb-4">Terjadi kesalahan saat upload. Silahkan coba lagi.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}