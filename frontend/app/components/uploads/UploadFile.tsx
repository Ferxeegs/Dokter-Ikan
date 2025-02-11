import React, { useState, useRef } from "react";

interface UploadFileButtonProps {
  setImageUrls: (urls: string[]) => void; // Prop untuk menyimpan URL gambar (array karena multiple)
}

export default function UploadFileButton({ setImageUrls }: UploadFileButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrls, setImageUrlsState] = useState<string[]>([]); // Menyimpan URL gambar yang diupload
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log("Selected files:", Array.from(files).map((file) => file.name));

    const formData = new FormData();
    // Tambahkan semua file ke FormData
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Gabungkan filePaths baru dengan filePaths yang sudah ada
        setImageUrlsState((prevImageUrls) => [...prevImageUrls, ...result.filePaths]); // Menambahkan file baru
        setImageUrls([...imageUrls, ...result.filePaths]); // Mengupdate parent state
        
      } else {
        alert("Upload gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error saat mengupload:", error);
      alert("Terjadi kesalahan saat mengupload.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
      >
        <img src="/images/icon/ic_file.png" alt="File" className="w-4 h-4" />
        <span>File</span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />
    </div>
  );
}
