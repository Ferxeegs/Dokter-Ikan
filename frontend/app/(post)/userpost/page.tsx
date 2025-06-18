'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import UploadFile from '@/app/components/uploads/UploadFile';
import UploadFotoButton from '@/app/components/uploads/UploadFoto';
import ComplaintPost from '@/app/components/complaints/Complaintpost';
import Answer from '@/app/components/answers/Answer';
import WelcomeModal from '@/app/components/modals/WelcomeModal';
import Modal from '@/app/components/modals/ModalPost';
import { ClipLoader } from "react-spinners";

type FishType = {
  id: number;
  name: string;
};

interface User {
  id: number;
}

export default function UserPost() {
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true); // Set to true to show on page load
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [judul, setJudul] = useState('');
  const [jenisIkan, setJenisIkan] = useState('');
  const [panjang, setPanjang] = useState('');
  const [berat, setBerat] = useState('');
  const [umur, setUmur] = useState('');
  const [message] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [fishtypes, setFishtypes] = useState<FishType[]>([]); // Type for fishtypes state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Status dropdown
  const [fishTypeId, setFishTypeId] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [shouldResetForm, setShouldResetForm] = useState(false);
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

  // State untuk modal login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading, true = authenticated, false = not authenticated

  const router = useRouter();

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('User tidak terautentikasi.');
        return null;
      }

      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, [API_BASE_URL]);

  const fetchFishTypes = useCallback(async () => {
    if (!API_BASE_URL) return;

    try {
      console.log('Fetching fish types...');
      const response = await fetch(`${API_BASE_URL}/fish-types`, {
        method: 'GET',
        credentials: 'include', // Konsisten menggunakan credentials
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fish types data:', data);

      const transformedData = data.data.map((fish: { fish_type_id: number; name: string }) => ({
        id: fish.fish_type_id,
        name: fish.name,
      }));
      setFishtypes(transformedData);
    } catch (error) {
      console.error('Error fetching fish types:', error);
    }
  }, [API_BASE_URL]);

  // Auth check menggunakan API verification
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      const user = await getCurrentUser();

      if (!user) {
        console.warn('Pengguna tidak terautentikasi.');
        setIsAuthenticated(false);
        setShowLoginModal(true); // Tampilkan modal login
      } else {
        console.log('User authenticated:', user);
        setUserId(user.id);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [getCurrentUser]);

  // Fetch fish types setelah auth berhasil
  useEffect(() => {
    if (userId) {
      fetchFishTypes();
    }
  }, [userId, fetchFishTypes]);

  // Handler untuk modal login
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    router.push('/login'); // Redirect ke login setelah modal ditutup
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    router.push('/login');
  };

  const handleSubmit = async () => {
    // Cek authentication terlebih dahulu
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Validasi input
    if (!judul.trim()) {
      setModalMessage("Judul keluhan tidak boleh kosong.");
      setShowModal(true);
      return;
    }

    if (!inputText.trim()) {
      setModalMessage("Deskripsi keluhan tidak boleh kosong.");
      setShowModal(true);
      return;
    }

    if (!fishTypeId) {
      setModalMessage("Jenis ikan harus dipilih.");
      setShowModal(true);
      return;
    }

    // Get current user untuk memastikan masih authenticated
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      setModalMessage("Pengguna tidak terautentikasi.");
      setShowModal(true);
      return;
    }

    if (!API_BASE_URL) {
      setModalMessage("API URL tidak ditemukan.");
      setShowModal(true);
      return;
    }

    setLoading(true); // Start loading

    const requestData = {
      user_id: currentUser.id,
      fish_type_id: fishTypeId,
      fish_age: String(umur),
      fish_length: String(panjang),
      fish_weight: String(berat),
      consultation_topic: judul,
      fish_image: JSON.stringify(images.map((image) => image.url)),
      complaint: inputText,
      consultation_status: 'Waiting',
    };

    try {
      // Request pertama: buat user consultation
      const response = await fetch(`${API_BASE_URL}/user-consultations`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
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

        // Request kedua: buat consultation
        const consultationRequest = {
          user_id: currentUser.id,
          user_consultation_id: userConsultationId,
        };

        const consultationResponse = await fetch(`${API_BASE_URL}/consultations`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(consultationRequest),
        });

        const consultationResponseData = await consultationResponse.json();

        if (!consultationResponse.ok) {
          console.error("Error dari konsultasi API:", consultationResponseData);
          throw new Error("Gagal menambahkan data ke tabel consultations");
        }

        // Success message
        setModalMessage("Konsultasi berhasil ditambahkan! Silakan menunggu hingga ahli ikan memberikan respons.");
        setShouldResetForm(true); // Set flag untuk reset form
      } else {
        console.error("Error dari backend:", responseData);
        setModalMessage(responseData.message || "Terjadi kesalahan pada backend");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      setModalMessage("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    } finally {
      setLoading(false); // Stop loading
      setShowModal(true);
    }
  };

  const resetForm = () => {
    setJudul('');
    setInputText('');
    setJenisIkan('');
    setPanjang('');
    setBerat('');
    setUmur('');
    setImages([]);
    setFishTypeId(null);
    setShouldResetForm(false);
  };

  // Update modal onClose handler
  const handleModalClose = () => {
    setShowModal(false);

    // Reset form jika berhasil submit
    if (shouldResetForm) {
      resetForm();
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUploadStart = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setLoading(true);
  }, [isAuthenticated]);

  const handleUploadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleJenisIkanClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

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

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  // Handler untuk input yang memerlukan authentication
  const handleAuthenticatedInput = (callback: () => void) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    callback();
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

      {/* Welcome Modal that shows on page load */}
      {isAuthenticated && (
        <WelcomeModal isOpen={isWelcomeModalOpen} onClose={closeWelcomeModal} />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full shadow-lg">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Akses Terbatas
              </h3>
              <p className="text-gray-600 mb-6">
                Anda harus login terlebih dahulu untuk mengakses fitur posting keluhan dan konsultasi dengan ahli ikan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLoginRedirect}
                  className="flex-1 bg-[#1A83FB] hover:bg-[#0066CC] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Login Sekarang
                </button>
                <button
                  onClick={handleLoginModalClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="w-full max-w-5xl p-4">
            <input
              type="text"
              className="w-full p-4 mb-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
              placeholder="Masukkan judul keluhan..."
              value={judul}
              onChange={(e) => handleAuthenticatedInput(() => setJudul(e.target.value))}
              onFocus={() => handleAuthenticatedInput(() => { })}
            />

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div className="relative w-full md:w-1/4">
                <input
                  type="text"
                  className="w-full p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                  placeholder="Jenis Ikan"
                  value={jenisIkan}
                  onClick={handleJenisIkanClick}
                  onChange={(e) => handleAuthenticatedInput(() => setJenisIkan(e.target.value))}
                  onFocus={() => handleAuthenticatedInput(() => { })}
                />
                {isDropdownOpen && fishtypes.length > 0 && isAuthenticated && (
                  <div className="absolute left-0 w-full text-black bg-white shadow-lg border-2 border-[#0795D2] rounded-lg z-50 mt-1 max-h-60 overflow-y-auto">
                    {fishtypes.map((fish) => (
                      <div
                        key={fish.id}
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
                onChange={(e) => handleAuthenticatedInput(() => setPanjang(e.target.value))}
                onFocus={() => handleAuthenticatedInput(() => { })}
              />
              <input
                type="number"
                className="w-full md:w-1/4 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Berat ikan (g)"
                value={berat}
                onChange={(e) => handleAuthenticatedInput(() => setBerat(e.target.value))}
                onFocus={() => handleAuthenticatedInput(() => { })}
              />
              <input
                type="number"
                className="w-full md:w-1/4 p-4 border-2 border-[#0795D2] rounded-lg outline-none text-black font-sans bg-white"
                placeholder="Umur ikan (bulan)"
                value={umur}
                onChange={(e) => handleAuthenticatedInput(() => setUmur(e.target.value))}
                onFocus={() => handleAuthenticatedInput(() => { })}
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
                  onChange={(e) => handleAuthenticatedInput(() => setInputText(e.target.value))}
                  onFocus={() => handleAuthenticatedInput(() => { })}
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-4 relative min-h-[100px] ml-24">
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

      {/* Regular modal for messages */}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
        />
      )}
      <Footer />
    </div>
  );
}