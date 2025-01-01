import React, { useRef } from 'react';

export default function UploadFileButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Referensi ke input file

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Klik otomatis pada input file
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Ambil file yang dipilih
    if (file) {
      console.log('Selected file:', file.name);
      // Tambahkan logika unggah file di sini
    }
  };

  return (
    <div>
      {/* Button */}
      <button
        className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2"
        onClick={handleButtonClick}
      >
        <img src="/file.png" alt="File" className="w-4 h-4" />
        <span>File</span>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
