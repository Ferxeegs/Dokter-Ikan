"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import UploadFotoButton from '@/app/components/uploads/UploadFoto';
import UploadVideoButton from '@/app/components/uploads/UploadVideo';
import UploadFileButton from '@/app/components/uploads/UploadFile';
import Complaint from '@/app/components/complaints/Complaint';
import Answer from '@/app/components/answers/Answer';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [data, setData] = useState<{
    title: string;
    description: string;
    fishType: string;
    fishLength: string;
    fishAge: string;
    fishImageUrls: string;
    answer: string;
    fish_expert_name: string;
    fish_expert_specialization: string;
  } | null>(null);

  const getUserIdFromToken = (): number | null => {
    const token = Cookies.get('token');
    console.log('Token :', token); // Debugging token
    
    if (!token) {
      console.warn('Token tidak ditemukan.');
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

  useEffect(() => {
    const userId = getUserIdFromToken();
    fetchFishTypes();  // Gunakan fungsi
    if (userId) {
      setUserId(userId);
    } else {
      console.warn('Pengguna tidak terautentikasi.');
    }
  }, []);

  const fetchFishTypes = async () => {
    try {
      const response = await fetch('http://localhost:9000/fish-types');
      const data = await response.json();
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
    const userId = getUserIdFromToken();
  
    if (!userId) {
      setMessage("Pengguna tidak terautentikasi.");
      return;
    }
  
    const token = Cookies.get("token");
    if (!token) {
      setMessage("Token autentikasi tidak ditemukan.");
      return;
    }
  
    const requestData = {
      user_id: userId,
      fish_type_id: fishTypeId,
      fish_age: String(berat),
      fish_length: String(panjang),
      consultation_topic: judul,
      fish_image: JSON.stringify(imageUrls),
      complaint: inputText,
      consultation_status: "Pending",
    };
  
    try {
      const response = await fetch("http://localhost:9000/user-consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      const responseData = await response.json();
      console.log("Respons dari /user-consultations:", responseData);
  
      if (response.ok) {
        const userConsultationId = responseData.data?.user_consultation_id || responseData.data?.id;
  
        if (!userConsultationId) {
          console.error("user_consultation_id tidak ditemukan dalam respons:", responseData);
          throw new Error("user_consultation_id not found in response");
        }
  
        const consultationRequest = {
          user_id: userId,
          user_consultation_id: userConsultationId,
        };
  
        const consultationResponse = await fetch("http://localhost:9000/consultations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(consultationRequest),
        });
  
        const consultationResponseData = await consultationResponse.json();
        console.log("Respons dari /consultations:", consultationResponseData);
  
        if (!consultationResponse.ok) {
          console.error("Error dari konsultasi API:", consultationResponseData);
          throw new Error("Gagal menambahkan data ke tabel consultations");
        }
  
        setMessage("Konsultasi berhasil ditambahkan");
      } else {
        console.error("Error dari backend:", responseData);
        setMessage(responseData.message || "Terjadi kesalahan pada backend");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      setMessage("Terjadi kesalahan saat mengirim data");
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

  const handleDeleteImage = async (url: string) => { // Terima URL gambar yang akan dihapus
    const token = Cookies.get("token");
    if (!token) {
      setMessage("Token autentikasi tidak ditemukan.");
      return;
    }
  
    try {
      // Ambil nama file dari URL gambar
      const fileName = url.split("/").pop();
  
      // Kirim request ke backend untuk menghapus gambar dari server lokal
      const response = await fetch("http://localhost:9000/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: fileName, // Kirim nama file ke backend
        }),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        // Hapus gambar dari state imageUrls setelah berhasil dihapus dari server
        setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url)); // Filter gambar yang tidak dihapus
        setMessage("Gambar berhasil dihapus.");
      } else {
        console.error("Error menghapus gambar:", responseData);
        setMessage("Gagal menghapus gambar.");
      }
    } catch (error) {
      console.error("Error saat menghapus gambar:", error);
      setMessage("Terjadi kesalahan saat menghapus gambar.");
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
        <Complaint 
          title={data?.title || 'Judul keluhan akan muncul di sini'} 
          description={data?.description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
          fishType={data?.fishType || 'Jenis ikan belum tersedia'}
          fishLength={data?.fishLength || 'Panjang ikan belum tersedia'}
          fishAge={data?.fishAge || 'Umur ikan belum tersedia'}
          fishImageUrls={Array.isArray(data?.fishImageUrls) ? data.fishImageUrls : data?.fishImageUrls ? [data.fishImageUrls] : []} 
        />
        <Answer
          toggleModal={toggleModal}
          answer={data?.answer || 'Jawaban akan muncul di sini setelah tenaga ahli memberikan respons.'}
          name={data?.fish_expert_name || 'Nama ahli belum tersedia'}
          specialization={data?.fish_expert_specialization || 'Spesialisasi ahli belum tersedia'}
        />
      </div>
      </main>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-5xl p-4"> {/* Lebarkan container */}
          <input
            type="text"
            className="w-full p-4 mb-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
            placeholder="Masukkan judul keluhan..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />

          <div className="flex space-x-4 mb-4">
            <div className="relative w-1/3"> {/* Semua input dalam flex-1 agar ukurannya sama */}
              <input
                type="text"
                className="w-full p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Jenis Ikan"
                value={jenisIkan}
                onClick={handleJenisIkanClick}
                onChange={(e) => setJenisIkan(e.target.value)}
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
              className="w-1/3 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Panjang ikan (cm)"
              value={panjang}
              onChange={(e) => setPanjang(e.target.value)}
            />
            <input
              type="number"
              className="w-1/3 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Umur ikan (bulan)"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
      <div className="flex items-center">
        <img
          src="/images/icon/ic_profile.png"
          alt="Foto Profil"
          className="w-12 h-12 rounded-full ml-4 mr-4"
        />
        <textarea
          className="flex-1 w-full h-32 p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
          placeholder="Masukkan keluhan yang ingin anda sampaikan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {/* Menampilkan gambar yang diupload */}
      {imageUrls.length > 0 && (
        <div className="relative mt-4 flex justify-start">
          {imageUrls.map((url: string, index: number) => (
            <div key={index} className="w-24 h-24 border rounded-lg overflow-hidden ml-4 relative">
              {/* Tombol silang di pojok kanan atas */}
              <button
                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-700 transition"
                onClick={() => handleDeleteImage(url)} // Hapus gambar berdasarkan URL
              >
                ✕
              </button>

              {/* Gambar yang diupload */}
              <img src={`http://localhost:9000${url}`} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
        </div>
      </div>

      <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
        <UploadFotoButton />
        <UploadVideoButton />
        <UploadFileButton setImageUrls={setImageUrls} />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
        >
          <img src="/images/icon/ic_send.png" alt="Kirim" className="w-4 h-4" />
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
