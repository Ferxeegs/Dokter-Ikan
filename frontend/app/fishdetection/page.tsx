'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useRef } from "react";

export default function FishDetection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadBoxRef = useRef<HTMLDivElement | null>(null); // Ref untuk elemen box unggah gambar

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const scrollToUploadBox = () => {
    if (uploadBoxRef.current) {
      const offsetTop = uploadBoxRef.current.offsetTop; // Jarak elemen dari atas halaman
      const scrollOffset = offsetTop - 200; // Kurangi dengan nilai offset untuk mencegah scroll terlalu ke bawah
      window.scrollTo({
        top: scrollOffset,
        behavior: 'smooth', // Gulir dengan animasi
      });
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: 'white',
        backgroundImage:
          'linear-gradient(to top, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 1) 80%), url("/bgpost.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        {/* Title */}
        <div className="ml-6 mt-28">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Deteksi Spesies Ikan dengan AI
          </h1>
          <h2 className="text-lg mb-6 text-[#2C2C2C]">
            Unggah foto ikan, dan teknologi AI kami akan menganalisis spesies serta penyakit yang mungkin diderita
          </h2>
        </div>

        {/* Buttons Container */}
        <div className="flex items-center justify-center gap-4 mb-8 mt-20">
          {/* Button for Upload */}
          <button
            onClick={scrollToUploadBox} // Scroll ke box unggah saat tombol diklik
            className="flex items-center justify-center bg-gradient-to-b from-[#0795D2] to-[#1A83FB] text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition w-64"
          >
            <span className="text-lg">Unggah Gambar</span>
          </button>

          {/* "atau" separator */}
          <span className="text-xl text-[#1A83FB]">atau</span>

          {/* Button for Camera Scan */}
          <button
            className="flex items-center justify-center bg-white text-[#0795D2] px-8 py-4 border-2 border-[#0795D2] rounded-2xl shadow-lg hover:shadow-2xl transition w-64"
          >
            <span className="text-lg">Pindai dengan Kamera</span>
          </button>
        </div>

        {/* Small Text */}
        <p className="text-xs text-black mb-8">
          Pilih salah satu metode untuk mengunggah atau memindai gambar ikan untuk analisis AI.
        </p>

        {/* Upload Box */}
        <div className="w-full max-w-lg mx-auto mt-32 p-6 bg-white border-2 border-blue-500 rounded-lg shadow-md">
  {/* Teks di atas kotak */}
  <p className="text-left text-lg font-semibold text-gray-700 mb-4">
    Upload Image for AI Analysis
  </p>
  
  <div
    ref={uploadBoxRef} // Tambahkan ref ke div box unggah gambar
    className="w-full max-w-md mx-auto border-dashed border-2 border-gray-300 rounded-lg"
  >
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 8a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm5-4a2 2 0 114 0v1h2a1 1 0 011 1v2H5V6a1 1 0 011-1h2V4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="mt-2 text-sm text-gray-600">
          Drag & drop your image here <br /> or
        </span>
      </div>
      <button
        type="button"
        onClick={handleBrowseClick}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Browse
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log("File selected:", file.name);
          }
        }}
      />
    </div>
  </div>
  <div className="bg-blue-100 text-blue-600 p-4 mt-4 rounded-lg">
    <p className="text-sm font-medium">AI Detected Result:</p>
    <p className="text-sm">Upload an image to see the result.</p>
  </div>
</div>


      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
