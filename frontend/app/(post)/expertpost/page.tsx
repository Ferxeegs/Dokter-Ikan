'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Complaint from '@/app/components/complaints/Complaint';
import Answer from '@/app/components/answers/AnswerExpert';
import UploadFile from '@/app/components/uploads/UploadFile';
import UploadFotoButton from '@/app/components/uploads/UploadFoto';
import ModalObat from '@/app/components/modals/ModalMedicine';
import { useSearchParams } from 'next/navigation';
import ModalExpert from '@/app/components/modals/ModalExpert'; // Import ModalExpert
import ChatExpert from '@/app/components/chat/ChatExpert';
import Image from 'next/image';
import { ClipLoader } from "react-spinners";

function ExpertPostContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || ''; // Default to empty string if id is null
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    title: string;
    description: string;
    answer: string;
    fish_expert_name: string;
    fish_expert_specialization: string;
    fish_type: string;
    fish_length: string;
    fish_weight: string;
    fish_age: string;
    fish_image: string;
    name: string;
    chat_enabled: boolean;
    created_at: string;
  } | null>(null);

  const handleUploadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const handleUploadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleUploadSuccess = useCallback((uploadedImages: { url: string; public_id: string }[]) => {
    const formattedImages = uploadedImages.map((img) => ({
      url: img.url,
      publicId: img.public_id,
    }));

    setImages((prevImages) => [...prevImages, ...formattedImages]);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalPostOpen(false);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async () => {
    try {
      // Ambil informasi fishExpert_id dari backend melalui /verify-token
      const verifyResponse = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!verifyResponse.ok) {
        setModalMessage("Pengguna tidak terautentikasi. Silakan login ulang.");
        setIsModalPostOpen(true);
        return;
      }

      const userData = await verifyResponse.json();
      const fishExpert_id = userData?.user?.id;

      // Kirim jawaban fish expert
      const answerResponse = await fetch(`${API_BASE_URL}/fish-expert-answers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fishExpert_id,
          answer: inputText,
          image: JSON.stringify(images.map((image) => image.url)),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!answerResponse.ok) {
        const errorData = await answerResponse.json();
        throw new Error(errorData.message || "Kolom jawaban tidak boleh kosong!");
      }

      const answerResult = await answerResponse.json();
      const fish_expert_answer_id = answerResult.data.fish_expert_answer_id;

      // Update status konsultasi
      const consultationUpdateResponse = await fetch(`${API_BASE_URL}/consultations/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fish_expert_answer_id,
          consultation_status: "In Consultation",
        }),
      });

      if (!consultationUpdateResponse.ok) {
        const errorData = await consultationUpdateResponse.json();
        throw new Error(errorData.message || "Gagal memperbarui konsultasi.");
      }

      setModalMessage("Jawaban berhasil dikirim");
      setIsModalPostOpen(true);
      setInputText(""); // Reset input
      setImages([]); // Reset images
    } catch (error) {
      setModalMessage((error as Error).message || "Terjadi kesalahan.");
      setIsModalPostOpen(true);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
          method: 'GET',
          credentials: 'include', // Kirim cookie HttpOnly
        });

        if (!response.ok) {
          throw new Error('Gagal memuat data');
        }

        const result = await response.json();
        setData(result.data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, API_BASE_URL]);


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-red-600">Terjadi kesalahan saat memuat data.</p>
      </div>
    );
  }

  const fishImageUrls = JSON.parse(data.fish_image || '[]').map((image: string) => `${image}`);

  const handleDeleteImage = async (publicId: string) => {
    if (!publicId) {
      alert("No public_id provided");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.publicId !== publicId));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
    setLoading(false);
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
        <div className="ml-6 mt-32 font-sans">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#1A83FB] text-center">
            Konsultasi Masalah Ikan Anda
          </h1>
          <h2 className="text-xs sm:text-sm mb-6 font-semibold text-[#2C2C2C] text-center">
            Masukkan keluhan Anda dan dapatkan solusi dari tenaga ahli
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          <Complaint
            title={data.title}
            description={data.description}
            fishType={data.fish_type}
            fishLength={data.fish_length}
            fishWeight={data.fish_weight}
            fishAge={data.fish_age}
            fishImageUrls={fishImageUrls}
            senderName={data.name}
            consultationDate={data.created_at}
          />

          <Answer
            answer={data.answer}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
          />
        </div>
        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
          <div className="flex justify-center mt-6">
            <button
              className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2"
              onClick={toggleModal}
            >
              <Image src="/images/icon/ic_obat.png" alt="Icon" width={24} height={24} />
              <div className="flex flex-col text-left font-sans">
                <span className="font-light text-xs italic">Ayo bantu klien lebih lanjut</span>
                <span className="font-bold text-sm">Berikan resep obat disini!</span>
              </div>
            </button>
          </div>
        ) : null}
        <ModalObat isOpen={isModalOpen} toggleModal={toggleModal} consultationId={id} />
        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
          <div className="flex flex-col w-full p-4 border-2 border-[#0795D2] rounded-lg shadow-md mt-8 max-w-5xl mx-auto justify-center">
            <div className="flex items-center">
              <Image
                src="/images/icon/ic_profile.png"
                alt="Foto Profil"
                width={48}
                height={48}
                className="rounded-full ml-4 mr-4"
                unoptimized={true}
              />
              <textarea
                className="flex-1 w-full h-32 p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
                placeholder="Masukkan jawaban dari keluhan..."
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
        ) : null}

        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6 mx-6 font-sans">
            <UploadFotoButton
              uploadUrl={`${API_BASE_URL}/uploadcloudexpert`}
              onUploadSuccess={handleUploadSuccess}
              isLoading={loading}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />

            {API_BASE_URL && (
              <UploadFile
                uploadUrl={`${API_BASE_URL}/uploadcloudexpert`}
                onUploadSuccess={handleUploadSuccess}
                isLoading={loading}
                onUploadStart={handleUploadStart}
                onUploadEnd={handleUploadEnd}
              />
            )}
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
            >
              <Image src="/images/icon/ic_send.png" alt="Kirim" width={16} height={16} />
              <span>Kirim</span>
            </button>
            {isModalPostOpen && <ModalExpert message={modalMessage} onClose={handleCloseModal} />}
          </div>
        ) : null}

        <div className="mt-10 mx-auto w-full max-w-4xl px-4">
          {data.chat_enabled === true && <ChatExpert consultationId={id} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ExpertPost() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ExpertPostContent />
    </React.Suspense>
  );
}