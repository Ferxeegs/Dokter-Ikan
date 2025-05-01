'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import UploadFile from '@/app/components/uploads/UploadFile';
import UploadFotoButton from '@/app/components/uploads/UploadFoto';
import ComplaintPost from '@/app/components/complaints/Complaintpost';
import Answer from '@/app/components/answers/Answer';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import Modal from '@/app/components/modals/ModalPost';
import { ClipLoader } from "react-spinners";

type FishType = {
  id: number;
  name: string;
};

export default function UserPost() {
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [judul, setJudul] = useState('');
  const [jenisIkan, setJenisIkan] = useState('');
  const [panjang, setPanjang] = useState('');
  const [berat, setBerat] = useState('');
  const [umur, setUmur] = useState('');
  const [message] = useState('');
  const [, setUserId] = useState<number | null>(null);
  const [fishtypes, setFishtypes] = useState<FishType[]>([]); // Type for fishtypes state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Status dropdown
  const [fishTypeId, setFishTypeId] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [data] = useState<{
    title: string;
    description: string;
    fishType: string;
    fishLength: string;
    fishWeight: string;
    fishAge: string;
    fishImageUrls: string;
    answer: string;
    fish_expert_name: string;
    fish_expert_specialization: string;
    consultation_status: string;
  } | null>(null);

  const getUserIdFromToken = useCallback((): number | null => {
    const token = Cookies.get('token');

    if (!token) {
      console.warn('Token tidak ditemukan.');
      return null;
    }
    try {
      const decodedToken: { id: number } = jwt_decode(token);
      return decodedToken.id || null; // Pastikan mengembalikan null jika user_id tidak ada
    } catch (error) {
      console.error('Error decoding token:', error); // Debugging error decoding
      return null;
    }
  }, []);

  const fetchFishTypes = useCallback(async () => {
    if (!API_BASE_URL) return; // Don't attempt fetch if BASE_URL is undefined

    try {
      const response = await fetch(`${API_BASE_URL}/fish-types`);
      const data = await response.json();
      const transformedData = data.data.map((fish: { fish_type_id: number; name: string }) => ({
        id: fish.fish_type_id, // Ubah fish_type_id ke id
        name: fish.name, // Tambahkan properti name
      }));
      setFishtypes(transformedData);
    } catch (error) {
      console.error('Error fetching fish types:', error);
    }
  }, [API_BASE_URL]);

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login'); // atau redirect ke halaman login jika ada
    }
  }, []);

  useEffect(() => {
    const id = getUserIdFromToken();
    fetchFishTypes();
    if (id) {
      setUserId(id);
    } else {
      console.warn('Pengguna tidak terautentikasi.');
    }
  }, [fetchFishTypes, getUserIdFromToken]);

  const handleSubmit = async () => {
    const currentUserId = getUserIdFromToken();

    if (!currentUserId) {
      setModalMessage("Pengguna tidak terautentikasi.");
      setShowModal(true);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setModalMessage("Token autentikasi tidak ditemukan.");
      setShowModal(true);
      return;
    }

    if (!API_BASE_URL) {
      setModalMessage("API URL tidak ditemukan.");
      setShowModal(true);
      return;
    }

    const requestData = {
      user_id: currentUserId,
      fish_type_id: fishTypeId,
      fish_age: String(umur),
      fish_length: String(panjang),
      fish_weight: String(berat),
      consultation_topic: judul,
      fish_image: JSON.stringify(images.map((image) => image.url)), complaint: inputText,
      consultation_status: 'Waiting',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/user-consultations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok) {
        const userConsultationId = responseData.data?.user_consultation_id || responseData.data?.id;

        if (!userConsultationId) {
          console.error("user_consultation_id tidak ditemukan dalam respons:", responseData);
          throw new Error("user_consultation_id not found in response");
        }

        const consultationRequest = {
          user_id: currentUserId,
          user_consultation_id: userConsultationId,
        };

        const consultationResponse = await fetch(`${API_BASE_URL}/consultations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(consultationRequest),
        });

        const consultationResponseData = await consultationResponse.json();

        if (!consultationResponse.ok) {
          console.error("Error dari konsultasi API:", consultationResponseData);
          throw new Error("Gagal menambahkan data ke tabel consultations");
        }

        setModalMessage("Konsultasi berhasil ditambahkan, silahkan menunggu hingga ahli ikan memberikan respons!");
      } else {
        console.error("Error dari backend:", responseData);
        setModalMessage(responseData.message || "Terjadi kesalahan pada backend");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      setModalMessage("Terjadi kesalahan saat mengirim data");
    }
    setShowModal(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUploadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const handleUploadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleJenisIkanClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleSelectFishType = (fishName: string) => {
    setJenisIkan(fishName); // Update selected fish name
    const selectedFish = fishtypes.find(fish => fish.name === fishName); // Find fish by name
    if (selectedFish) {
      setFishTypeId(selectedFish.id); // Update fish type ID
    } else {
      console.warn('Fish not found for name:', fishName); // Log warning if fish not found
    }
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleDeleteImage = async (publicId: string) => {
    if (!publicId) {
      alert("No public_id provided");
      return;
    }

    if (!API_BASE_URL) {
      alert("API URL tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }), // Kirim publicId ke server
      });

      const data = await response.json();
      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.publicId !== publicId)); // Hapus gambar dari state
      } else {
        alert(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
    setLoading(false);
  };

  const handleUploadSuccess = useCallback((uploadedImages: { url: string; public_id: string }[]) => {
    // Map the images to ensure consistent property names
    const formattedImages = uploadedImages.map((img: { url: string; public_id: string }) => ({
      url: img.url,
      publicId: img.public_id, // Convert from public_id to publicId
    }));

    setImages((prevImages) => [...prevImages, ...formattedImages]);
    setLoading(false); // Stop loading when upload is complete
  }, []);

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
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#1A83FB]">
            Posting Keluhan Anda Disini!
          </h1>
          <h2 className="text-sm sm:text-base mb-6 font-semibold text-[#2C2C2C]">
            Masukan keluhan diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          <ComplaintPost
            title={judul}
            description={inputText}
            fishType={jenisIkan}
            fishLength={panjang}
            fishWeight={berat}
            fishAge={umur}
            fishImageUrls={images.map((image) => image.url)}
          />
          <Answer
            toggleModal={toggleModal}
            answer={data?.answer || 'Jawaban akan muncul di sini setelah ahli memberikan respons.'}
            name={data?.fish_expert_name || 'Nama ahli belum tersedia'}
            specialization={data?.fish_expert_specialization || 'Spesialisasi ahli belum tersedia'}
            consultation_status={data?.consultation_status || 'Status konsultasi belum tersedia'}
          />
        </div>


        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-5xl p-4"> {/* Lebarkan container */}
            <input
              type="text"
              className="w-full p-4 mb-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Masukkan judul keluhan..."
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div className="relative w-full md:w-1/4"> {/* Semua input dalam flex-1 agar ukurannya sama */}
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
                    {fishtypes.map((fish) => (
                      <div
                        key={fish.id} // Use ONLY fish.id as the key, not combined with index
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
                className="w-full md:w-1/4 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Panjang ikan (cm)"
                value={panjang}
                onChange={(e) => setPanjang(e.target.value)}
              />
              <input
                type="number"
                className="w-full md:w-1/4 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Berat ikan (g)"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
              />
              <input
                type="number"
                className="w-full md:w-1/4 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Umur ikan (bulan)"
                value={umur}
                onChange={(e) => setUmur(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-full p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
              <div className="flex items-center">
                <img
                  src="/images/icon/ic_profile.png"
                  alt="Foto Profil"
                  width={48}
                  height={48}
                  className="rounded-full ml-4 mr-4"
                />
                <textarea
                  className="flex-1 w-full h-32 p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
                  placeholder="Masukkan keluhan yang ingin anda sampaikan..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-4 relative min-h-[100px] ml-24">
                {/* Loading indicator centered in the image preview area */}
                {loading && (
                  <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-white bg-opacity-50 z-1 rounded-lg">
                    <ClipLoader color="#69CBF4" size={50} />
                  </div>
                )}

                {images.length > 0 &&
                  images.map((image) => (
                    <div key={image.publicId} className="relative w-32 h-32 rounded-lg border overflow-hidden">
                      <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(image.publicId)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-700 transition"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-12 justify-center mt-6 mx-6 font-sans">
          <UploadFotoButton
            uploadUrl={`${API_BASE_URL}/uploadclouduser`}
            onUploadSuccess={handleUploadSuccess}
            isLoading={loading}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />

          {API_BASE_URL && (
            <UploadFile
              uploadUrl={`${API_BASE_URL}/uploadclouduser`}
              onUploadSuccess={handleUploadSuccess}
              isLoading={loading}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          )}

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-4 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
            type="button"
          >
            <img src="/images/icon/ic_send.png" alt="Kirim" width={16} height={16} />
            <span>Kirim</span>
          </button>
        </div>

        {message && (
          <div className="mt-4 text-center text-lg font-semibold text-[#1A83FB]">
            {message}
          </div>
        )}
      </main>

      {/* Modal moved outside of render flow to avoid potential state updates during render */}
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}

      <Footer />
    </div>
  );
}