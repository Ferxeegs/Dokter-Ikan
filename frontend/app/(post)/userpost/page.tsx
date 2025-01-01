'use client';

import { useState } from 'react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Link from 'next/link';
import UploadFotoButton from '@/app/components/upload-foto';
import UploadVideoButton from '@/app/components/upload-video';
import UploadFileButton from '@/app/components/upload-file';

export default function UserPost() {
  const [inputText, setInputText] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [jenisIkan, setJenisIkan] = useState('');
  const [panjang, setPanjang] = useState('');
  const [berat, setBerat] = useState('');


  const handleSubmit = () => {
    setDescription(inputText);
    setInputText('');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
        <div className="ml-6 mt-32 font-sans text-center">
          <h1 className="text-2xl font-bold mb-2 text-[#1A83FB]">
            Posting Keluhan Anda Disini!
          </h1>
          <h2 className="text-base mb-6 font-semibold text-[#2C2C2C]">
            Masukan gejala - gejala yang diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          {/* Kotak Keluhan */}
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-4 text-center">
              Muncul Bintik Putih
            </h3>
            <p className="text-sm text-gray-700 text-justify">
              {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
            </p>
          </div>

          {/* Kotak Jawaban */}
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-56 border-4 border-[#1A83FB] overflow-y-auto relative">
            <h3 className="text-xl font-bold text-black mb-4 text-center">
              Jawaban Tenaga Ahli
            </h3>
            <p className="text-sm text-gray-700 text-justify mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus purus at lacus pharetra suscipit.
            </p>

            {/* Button untuk melihat detail resep */}
            <button
              className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-xs font-bold"
              style={{
                backgroundColor: 'rgba(105, 203, 244, 0.3)',
                color: 'black',
              }}
              onClick={toggleModal}
            >
              Lihat Detail Resep
            </button>

            {/* Foto Profil */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <img src="profil.png" alt="Foto Profil" className="w-10 h-10 rounded-full" />
              <div className="flex flex-col text-left font-sans">
                <span className="text-sm font-bold text-black">Nama Tenaga Ahli</span>
                <span className="text-xs font-light text-black italic">Spesialis Ikan</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Pop-up */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-[90%] md:w-[40%] relative overflow-y-auto max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold font-sans text-black mb-4 text-center">Resep Obat dari Tenaga Ahli</h2>
            <div className="font-sans space-y-4 mb-6">
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
                    src="https://via.placeholder.com/100"
                    alt={`Obat ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-black">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.content}</p>
                    <p className="text-sm text-gray-700">{item.dose}</p>
                    <p className="text-sm text-gray-700">{item.usage}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tombol Tutup */}
            <button
              className="absolute top-2 right-2 text-black font-bold text-lg"
              onClick={toggleModal}
            >
              &times;
            </button>

            {/* Tombol Pembayaran */}
            <Link
              href="/payment"
              className="text-center mt-auto bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Ke menu pembayaran
            </Link>
          </div>
        </div>
      )}

        {/* Kotak Input */}
          <div className="mt-8 flex justify-center">
          <div className="w-[80%] p-4">
            {/* Input untuk Judul */}
            <input
              type="text"
              className="w-full p-4 mb-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Masukkan judul keluhan..."
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
            
            {/* Input untuk Jenis Ikan */}
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                className="flex-1 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Jenis Ikan"
                value={jenisIkan}
                onChange={(e) => setJenisIkan(e.target.value)}
              />
              {/* Input untuk Panjang */}
              <input
                type="number"
                className="w-[30%] p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Panjang ikan (cm)"
                value={panjang}
                onChange={(e) => setPanjang(e.target.value)}
              />
              {/* Input untuk Berat */}
              <input
                type="number"
                className="w-[30%] p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Umur ikan (bulan)"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
              />
            </div>
            
            {/* Textarea untuk Keluhan */}
            <div className="flex items-center w-full h-32 p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
              <img src="profil.png" alt="Foto Profil" className="w-12 h-12 rounded-full ml-8 mr-4" />
              <textarea
                className="flex-1 h-full p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
                placeholder="Masukkan jawaban dari keluhan yang diberikan klien..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Empat Button Berderet */}
        <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
          <UploadFotoButton />
          <UploadVideoButton/>
          <UploadFileButton/>
          <button className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2">
            <img src="send.png" alt="Kirim" className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}
