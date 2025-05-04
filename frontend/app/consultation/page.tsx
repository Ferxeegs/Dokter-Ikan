'use client';

import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Complaint from '@/app/components/complaints/Complaint';
import Answer from '@/app/components/answers/Answer';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailResep from '@/app/components/prescriptions/DetailResep';
import ChatConsultation from '@/app/components/chat/ChatConsultation';
import ConsultationRules from '@/app/components/rules/ConsultationRules';
import EndConsultationButton from '@/app/components/rules/EndConsultationButton';
import Cookies from 'js-cookie';

function ConsultationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const consultationId = Array.isArray(id) ? id[0] : id;

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
    answer_image: string;
    chat_enabled: boolean;
    consultation_status: string;
    name: string;
    created_at: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`);
        if (!response.ok) {
          throw new Error('Gagal memuat data');
        }
        const result = await response.json();
        setData(result.data);
        setIsChatEnabled(result.data.chat_enabled);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [consultationId, API_BASE_URL]);

  if (!consultationId) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-red-600">Consultation ID tidak ditemukan.</p>
      </div>
    );
  }

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
  let fishImageUrl: string[] = [];
  try {
    fishImageUrl = data.answer_image && data.answer_image.startsWith('[')
      ? JSON.parse(data.answer_image).map((image: string) => `${image}`)
      : [];
  } catch {
    fishImageUrl = [];
  }

  const enableChat = async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/enable-chat`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chat_enabled: true }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengaktifkan chat");
      }

      setIsChatEnabled(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Terjadi kesalahan yang tidak diketahui:", error);
      }
      alert("Terjadi kesalahan saat mengaktifkan fitur chat.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative"
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

      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col px-6 pt-24 pb-4">
        {/* Title Section - Centered on all screens */}
        <div className="w-full text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A83FB]">
            Konsultasi Masalah Ikan Anda
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-[#2C2C2C]">
            Keluhan Anda akan Terjawab Disini
          </h2>
        </div>

        {/* Rules Button - Positioned at right */}
        <div className="self-end">
          <ConsultationRules />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-8 mx-6 font-sans">
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
            toggleModal={toggleModal}
            answer={data.answer}
            fishImageUrls={fishImageUrl}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
            consultation_status={data.consultation_status}
          />
        </div>

        {/* Chat Consultation Section */}
        <div className="mt-10 mx-auto w-full max-w-4xl px-4 mb-8">
          {!isChatEnabled ? (
            <div className="text-center bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-500 rounded-full p-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Konsultasi Lebih Interaktif
              </h3>
              <p className="text-lg font-semibold text-gray-700 mb-3">
                Gunakan fitur chat dengan biaya tambahan
              </p>
              <div className="bg-white rounded-lg p-4 shadow-inner mb-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Respon lebih cepat dari ahli perikanan
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ajukan pertanyaan tambahan secara langsung
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Konsultasi lebih interaktif dengan ahli
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saran langsung untuk penanganan ikan
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Gunakan Fitur Chat
              </button>
            </div>
          ) : (
            <ChatConsultation consultationId={consultationId} />
          )}

          {showConfirmation && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-semibold text-gray-800">
                  Anda yakin ingin menggunakan fitur chat dengan biaya tambahan?
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={async () => {
                      await enableChat();
                      setIsChatEnabled(true);
                      setShowConfirmation(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* End Consultation Button at the bottom */}
        <div className="flex justify-center mb-8 px-4">
          <EndConsultationButton
            consultationId={consultationId}
            onEndSession={() => setIsChatEnabled(false)}
          />
        </div>
      </main>

      {isModalOpen && (
        <DetailResep
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          consultationId={consultationId}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function Consultation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}