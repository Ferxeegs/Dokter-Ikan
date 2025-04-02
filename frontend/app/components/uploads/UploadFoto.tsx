import React, { useRef, useState } from "react";
import Image from "next/image";

interface UploadFotoButtonProps {
  onUploadSuccess: (images: { url: string; public_id: string }[]) => void;
  isLoading: boolean;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}

export default function UploadFotoButton({ 
  onUploadSuccess, 
  isLoading, 
  onUploadStart, 
  onUploadEnd 
}: UploadFotoButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    // Notify parent that upload is starting
    onUploadStart();

    try {
      const response = await fetch(`${API_BASE_URL}/uploadcloud`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Use the same callback format as UploadFile
        onUploadSuccess(result.images);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error saat mengupload:", error);
      setShowErrorModal(true);
    } finally {
      onUploadEnd();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        <Image src="/images/icon/ic_foto.png" alt="Foto" width={16} height={16} />
        <span>{isLoading ? "Loading..." : "Kamera"}</span>
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        capture="environment"
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