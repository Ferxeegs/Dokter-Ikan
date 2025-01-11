'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import UploadFotoButton from '@/app/components/upload-foto';
import UploadVideoButton from '@/app/components/upload-video';
import UploadFileButton from '@/app/components/upload-file';
import DetailResep from '@/app/components/detail-resep';
import Complaint from '@/app/components/complaint';
import Answer from '@/app/components/Answer';
import jwt_decode from 'jwt-decode';


type FishType = {
  id: number;
  name: string;
};

export default function UserPost() {
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [jenisIkan, setJenisIkan] = useState('');
  const [panjang, setPanjang] = useState('');
  const [berat, setBerat] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [fishtypes, setFishtypes] = useState<FishType[]>([]); // Type for fishtypes state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Status dropdown
  const [fishTypeId, setFishTypeId] = useState<number | null>(null);

  // Fungsi untuk mendekode token dan mendapatkan user_id
  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem('token');
    console.log('Token dari localStorage:', token); // Debugging token
    
    if (!token) {
      console.warn('Token tidak ditemukan di localStorage.');
      return null;
    }
  
    try {
      const decodedToken: any = jwt_decode(token);
      console.log('Decoded Token:', decodedToken); // Debugging decoded token
      return decodedToken.id || null; // Pastikan mengembalikan null jika user_id tidak ada
    } catch (error) {
      console.error('Error decoding token:', error); // Debugging error decoding
      return null;
    }
  };
  

  // Mendapatkan userId dari token saat komponen pertama kali dimuat
  useEffect(() => {
    const userId = getUserIdFromToken();
    fetchFishTypes();  // Gunakan fungsi
    if (userId) {
      setUserId(userId);
      // Hanya fetch data jika userId valid
    } else {
      console.warn('Pengguna tidak terautentikasi.');
    }
  }, []);
  

  // Fetch fish types from API
  const fetchFishTypes = async () => {
    try {
      const response = await fetch('http://localhost:9000/fish-types');
      const data = await response.json();
  
      // Transformasi data agar fish_type_id dan name disertakan
      const transformedData = data.map((fish: any) => ({
        id: fish.fish_type_id, // Ubah fish_type_id ke id
        name: fish.name, // Tambahkan properti name
      }));
      setFishtypes(transformedData);
    } catch (error) {
      console.error('Error fetching fish types:', error);
    }
  };
  

  const handleSubmit = async () => {
    const userId = getUserIdFromToken(); // Mendapatkan userId dari token
  
    if (!userId) {
      setMessage('Pengguna tidak terautentikasi.');
      console.error("User ID not found from token");
      return;
    }
  
    // Validasi input
    console.log("Judul:", judul);
    console.log("Jenis Ikan:", fishTypeId);
    console.log("Berat:", berat);
    console.log("Panjang:", panjang);
    console.log("Description:", inputText);
  
    if (!judul || !fishTypeId || !berat || !panjang || !inputText) {
      console.warn('Invalid data:', { judul, fishTypeId, berat, panjang, inputText });
      setMessage('Harap isi semua data dengan benar.');
      return;
    }
  
    const requestData = {
      user_id: userId, // INTEGER
      fish_type_id: fishTypeId, // INTEGER
      fish_age: String(berat), // STRING
      fish_length: String(panjang), // STRING
      consultation_topic: judul, // TEXT
      fish_image: "https://example.com/images/fish.jpg", // STRING (opsional)
      complaint: inputText, // TEXT
      consultation_status: "Pending", // STRING
    };
  
    console.log('Request Data:', requestData); // Log data yang dikirim ke server
  
    try {
      const response = await fetch('http://localhost:9000/user-consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Konsultasi berhasil ditambahkan');
        console.log('Server Response:', data);
      } else {
        console.error('Server Response:', data);
        setMessage(data.message || 'Terjadi kesalahan. Coba lagi');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Coba lagi');
    }
  };
  
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleJenisIkanClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleSelectFishType = (fishName: string) => {
    setJenisIkan(fishName); // Update selected fish name
    const selectedFish = fishtypes.find(fish => fish.name === fishName); // Find fish by name
    console.log('Selected Fish:', selectedFish); // Debugging selected fish
    if (selectedFish) {
      setFishTypeId(selectedFish.id); // Update fish type ID
    } else {
      console.warn('Fish not found for name:', fishName); // Log warning if fish not found
    }
    setIsDropdownOpen(false); // Close dropdown
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
      <Navbar />

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
          <Complaint title={judul} description={inputText} />
          <Answer toggleModal={toggleModal} />
        </div>
      </main>

      <DetailResep isOpen={isModalOpen} toggleModal={toggleModal} />

      <div className="mt-8 flex justify-center">
        <div className="w-[80%] p-4">
          <input
            type="text"
            className="w-full p-4 mb-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
            placeholder="Masukkan judul keluhan..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />

          <div className="flex space-x-4 mb-4">
            <div className="relative">
              <input
                type="text"
                className="flex-1 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Jenis Ikan"
                value={jenisIkan}
                onClick={handleJenisIkanClick}
                onChange={(e) => setJenisIkan(e.target.value)} // Still allow typing in the input
              />
              {isDropdownOpen && fishtypes.length > 0 && (
                <div className="absolute left-0 w-full text-black bg-white shadow-lg border-2 border-[#0795D2] rounded-lg z-50 mt-1 max-h-60 overflow-y-auto">
                  {fishtypes.map((fish, index) => (
                    <div
                      key={`${fish.id}-${index}`}
                      className="p-2 cursor-pointer hover:bg-[#0795D2] hover:text-white"
                      onClick={() => handleSelectFishType(fish.name)}
                    >
                      {fish.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="number"
              className="w-[30%] p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Panjang ikan (cm)"
              value={panjang}
              onChange={(e) => setPanjang(e.target.value)}
            />
            <input
              type="number"
              className="w-[30%] p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Umur ikan (bulan)"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
            />
          </div>

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

      <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
        <UploadFotoButton />
        <UploadVideoButton />
        <UploadFileButton />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
        >
          <img src="send.png" alt="Kirim" className="w-4 h-4" />
          <span>Kirim</span>
        </button>
      </div>

      {message && (
        <div className="mt-4 text-center text-lg font-semibold text-[#1A83FB]">
          {message}
        </div>
      )}

      <Footer />
    </div>
  );
}
