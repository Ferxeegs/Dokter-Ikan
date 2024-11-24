'use client';

import { useState } from 'react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function UserPost() {
  const [inputText, setInputText] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    setDescription(inputText);
    setInputText('');
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
      <main className="flex-1">
        {/* Judul dan Sub-Judul */}
        <div className="ml-6 mt-32 font-sans">
          <h1 className="text-2xl font-bold mb-2 text-[#1A83FB] text-center">
            Posting Keluhan Anda Disini!
          </h1>
          <h2 className="text-base mb-6 font-semibold text-[#2C2C2C] text-center">
            Masukan gejala - gejala yang diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          {/* Kotak 1 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-4 text-center">Muncul Bintik Putih</h3>
            <p className="text-sm text-gray-700 text-justify">
              {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
            </p>
          </div>

          {/* Kotak 2 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-56 border-4 border-[#1A83FB] overflow-y-auto relative">
            <h3 className="text-xl font-bold text-black mb-4 text-center">Jawaban Tenaga Ahli</h3>
            <p className="text-sm text-gray-700 text-justify mb-8">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.
            </p>

            {/* Button untuk melihat detail resep */}
            <button
              className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-xs font-bold"
              style={{
                backgroundColor: 'rgba(105, 203, 244, 0.3)', // Transparan 30%
                color: 'black',
              }}
            >
              Lihat Detail Resep
            </button>

            {/* Foto Profil di kiri bawah */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <img src="profil.png" alt="Foto Profil" className="w-10 h-10 rounded-full" />
              <div className="flex flex-col text-left font-sans">
                <span className="text-sm font-bold text-black">Nama Tenaga Ahli</span>
                <span className="text-xs font-light text-black italic">Spesialis Ikan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Button di bawah Kotak 2 */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2"
            onClick={handleSubmit}
          >
            <img src="crown.png" alt="Icon" className="w-6 h-6" />
            <div className="flex flex-col text-left font-sans">
              <span className="font-light text-xs italic">Punya pertanyaan lebih lanjut?</span>
              <span className="font-bold text-sm">Chat Tenaga Ahli Sekarang!</span>
            </div>
          </button>
        </div>

        {/* Kotak Input */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center w-[80%] h-32 p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
            <img src="profil.png" alt="Foto Profil" className="w-12 h-12 rounded-full ml-8 mr-4" />
            <textarea
              className="flex-1 h-full p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
              placeholder="Masukkan detail keluhan atau informasi tambahan mengenai kondisi ikan Anda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>

        {/* Empat Button Berderet */}
        <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
          <button className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2">
            <img src="foto.png" alt="Foto" className="w-4 h-4" />
            <span>Foto</span>
          </button>
          <button className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2">
            <img src="video.png" alt="Video" className="w-4 h-4" />
            <span>Video</span>
          </button>
          <button className="bg-white text-[#69CBF4] px-6 py-2 rounded-lg hover:bg-[#f0f0f0] transition text-sm font-semibold w-full md:w-auto border-2 border-[#69CBF4] flex items-center justify-center space-x-2">
            <img src="file.png" alt="File" className="w-4 h-4" />
            <span>File</span>
          </button>
          <button className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2">
            <img src="send.png" alt="Kirim" className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
