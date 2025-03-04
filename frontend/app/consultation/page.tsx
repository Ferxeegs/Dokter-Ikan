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
        setData(result);
        setIsChatEnabled(result.chat_enabled);
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

  const baseUrl = `${API_BASE_URL}`;
  const fishImageUrls = JSON.parse(data.fish_image || '[]').map((image: string) => `${baseUrl}${image}`);
  let fishImageUrl: string[] = [];
  try {
    fishImageUrl = data.answer_image && data.answer_image.startsWith('[')
      ? JSON.parse(data.answer_image).map((image: string) => `${baseUrl}${image}`)
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

      {/* Consultation Rules Button (Moved to Top Right) */}
      <div className="absolute top-20 right-4 p-1">
        <ConsultationRules
          consultationId={consultationId}
          onEndSession={() => setIsChatEnabled(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="ml-6 mt-32 font-sans text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#1A83FB]">
            Konsultasi Masalah Ikan Anda
          </h1>
          <h2 className="text-sm sm:text-base mb-6 font-semibold text-[#2C2C2C]">
            Masukkan keluhan Anda dan dapatkan solusi dari tenaga ahli.
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
            toggleModal={toggleModal}
            answer={data.answer}
            fishImageUrls={fishImageUrl}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
            consultation_status={data.consultation_status}
          />
        </div>

        {/* Chat Consultation Section */}
        <div className="mt-10 mx-auto w-full max-w-4xl px-4">
          {!isChatEnabled ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                Gunakan fitur chat dengan biaya tambahan?
              </p>
              <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                <li>Respon lebih cepat dari ahli perikanan</li>
                <li>Dapat mengajukan pertanyaan tambahan secara langsung</li>
                <li>Konsultasi lebih interaktif dengan ahli</li>
                <li>Mendapatkan saran langsung untuk penanganan ikan</li>
              </ul>
              <button
                onClick={() => setShowConfirmation(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                Gunakan Fitur Chat
              </button>
            </div>
          ) : (
            <ChatConsultation consultationId={consultationId} />
          )}

          {showConfirmation && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
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