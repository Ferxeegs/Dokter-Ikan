import React, { useRef } from 'react';
import Image from 'next/image';

export default function UploadFotoButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Tipe eksplisit

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Pengecekan null sebelum akses
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Gunakan optional chaining
    if (file) {
      // Tambahkan logika untuk menangani file yang diunggah
    }
  };

  return (
    <div>
      {/* Button */}
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
      >
        <Image src="/images/icon/ic_foto.png" alt="Foto" width={16} height={16} />
        <span>Foto</span>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*" // Hanya menerima file gambar
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}