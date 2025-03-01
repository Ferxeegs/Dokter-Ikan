import React, { useRef } from "react";
import Image from "next/image";

interface UploadFotoButtonProps {
  setImageUrls: (urls: string[] | ((prevUrls: string[]) => string[])) => void;
}

export default function UploadFotoButton({ setImageUrls }: UploadFotoButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Pastikan sudah ada di .env

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file)); // Bisa multiple file

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImageUrls((prev) => [...prev, ...result.filePaths]); // Tambahkan URL baru ke state
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
        <Image src="/images/icon/ic_foto.png" alt="Foto" width={16} height={16} />
        <span>Foto</span>
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        capture="environment" // Membuka kamera langsung
        multiple
        style={{ display: "none" }}
      />
    </div>
  );
}
