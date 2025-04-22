'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';


interface Prediction {
  image_url: string;
  class_name: string;
}

export default function FishDetection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null); // Ref untuk input kamera
  const uploadBoxRef = useRef<HTMLDivElement | null>(null); // Ref untuk elemen box unggah gambar
  const [, setImageUrls] = useState<string[]>([]); // Menyimpan URL gambar yang diupload
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Pastikan hanya satu file yang diambil
    const file = files[0];  // Ambil file pertama saja

    console.log("Selected file:", file.name);

    const formData = new FormData();
    formData.append("file", file);  // Append file ke FormData dengan field 'file'

    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch(`${API_BASE_URL}/upload-fish`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setImageUrls((prevImageUrls) => [...prevImageUrls, ...result.predictions.map((prediction: Prediction) => prediction.image_url)]); // Simpan URL gambar hasil prediksi
        const className = result.predictions[0].class_name; // Ambil class_name dari hasil prediksi
        router.push(`/result-fish-detection?class_name=${encodeURIComponent(className)}`); // Redirect to result page with class_name as parameter
      } else {
        alert("Upload gagal: " + (result.message || "Terjadi kesalahan tak terduga"));
      }
    } catch (error) {
      console.error("Error saat mengupload:", error);
      alert("Terjadi kesalahan saat mengupload.");
    } finally {
      setIsLoading(false); // Set loading state to false
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
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#1A83FB] font-lato">
            Deteksi Spesies Ikan dengan AI
          </h1>
          <h2 className="text-sm sm:text-base mb-6 text-[#2C2C2C]">
            Unggah foto ikan, dan teknologi AI kami akan menganalisis spesies serta penyakit yang mungkin diderita
          </h2>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 mt-20">
          {/* Button for Upload */}
          <button
            onClick={scrollToUploadBox} // Scroll ke box unggah saat tombol diklik
            className="flex items-center justify-center bg-gradient-to-b from-[#0795D2] to-[#1A83FB] text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition w-full sm:w-64"
          >
            <span className="text-base">Unggah Gambar</span>
          </button>

          {/* "atau" separator */}
          <span className="text-lg text-[#1A83FB]">atau</span>

          {/* Button for Camera Scan */}
          <button
            onClick={handleCameraClick} // Buka kamera saat tombol diklik
            className="flex items-center justify-center bg-white text-[#0795D2] px-6 py-3 border-2 border-[#0795D2] rounded-2xl shadow-lg hover:shadow-2xl transition w-full sm:w-64"
          >
            <span className="text-base">Pindai dengan Kamera</span>
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
                onChange={handleFileChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment" // Membuka kamera
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 mt-4 rounded-lg">
            <p className="text-sm font-medium">AI Detected Result:</p>
            <p className="text-sm">Upload an image to see the result.</p>
          </div>
        </div>


        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Loading...</h2>
              <p className="text-gray-700 text-center">Please wait while we process your image.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}