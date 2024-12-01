'use client'

import { useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function ExpertPost() {
  const [inputText, setInputText] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const handleSubmit = () => {
    setDescription(inputText);
    setInputText('');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal open/close
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
          </div>
        </div>

        {/* Button di bawah Kotak 2 */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2"
            onClick={toggleModal} // Membuka modal saat tombol ditekan
          >
            <img src="obat.png" alt="Icon" className="w-6 h-6" />
            <div className="flex flex-col text-left font-sans">
              <span className="font-light text-xs italic">Ayo bantu klien lebih lanjut</span>
              <span className="font-bold text-sm">Berikan resep obat disini!</span>
            </div>
          </button>
        </div>

        {/* Modal: Card List Obat */}
        {isModalOpen && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={toggleModal} // Tutup modal saat area luar diklik
  >
    <div
      className="bg-white p-6 rounded-xl w-[80%] md:w-[50%] max-h-[70vh] overflow-y-auto relative"
      onClick={(e) => e.stopPropagation()} // Menghentikan bubbling agar modal tidak tertutup saat klik di dalamnya
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Rekomendasi Obat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Obat */}
        {[
          {
            title: 'Antibiotik',
            content: 'Kandungan: Amoxicillin',
            usage: 'Campurkan dengan air selama 7 hari.',
            dose: 'Takaran: 10mg/L air',
          },
          {
            title: 'Antijamur',
            content: 'Kandungan: Methylene Blue',
            usage: 'Rendam ikan selama 10 menit.',
            dose: 'Takaran: 5ml/L air',
          },
          {
            title: 'Vitamin',
            content: 'Kandungan: Multivitamin Kompleks',
            usage: 'Campurkan ke pakan setiap hari.',
            dose: 'Takaran: 1 tablet/10kg ikan',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow"
          >
            <img
              src="https://via.placeholder.com/80" // Ukuran gambar lebih kecil
              alt={`Obat ${index + 1}`}
              className="w-16 h-16 rounded-lg object-cover" // Ukuran gambar
            />
            <div className="ml-4">
              <h3 className="font-bold text-black text-xs">{item.title}</h3> {/* Ukuran teks lebih kecil */}
              <p className="text-xs text-gray-700">{item.content}</p> {/* Ukuran teks lebih kecil */}
              <p className="text-xs text-gray-700">{item.dose}</p>
              <p className="text-xs text-gray-700">{item.usage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Kirim Resep */}
      <div className="mt-4 text-center">
        <button
          className="bg-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold"
          onClick={() => alert('Resep telah dikirim ke klien.')} // Contoh aksi kirim resep
        >
          Kirim Resep ke Klien
        </button>
      </div>

      {/* Tombol Tutup Modal */}
      <button
        className="absolute top-2 right-2 text-black font-bold text-lg"
        onClick={toggleModal}
      >
        &times;
      </button>
    </div>
  </div>
)}



        {/* Kotak Input */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center w-[80%] h-32 p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
            <img src="profil.png" alt="Foto Profil" className="w-12 h-12 rounded-full ml-8 mr-4" />
            <textarea
              className="flex-1 h-full p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
              placeholder="Masukan jawaban dari keluhan yang diberikan klien..."
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
