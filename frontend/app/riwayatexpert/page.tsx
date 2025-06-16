'use client';

import { useEffect, useState } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CardRiwayatExpert from "../components/history/CardRiwayatExpert";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import Image from 'next/image';

interface DecodedToken {
  id: number;
}

interface ConsultationData {
  consultation_id: number;
  consultation_status: string;
  fishExpert_id: number;
  UserConsultation: {
    consultation_topic: string;
    complaint: string;
    createdAt: string;
  };
  User: {
    name: string;
  };
}

export default function RiwayatExpert() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertId, setExpertId] = useState<number | null>(null);
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchExpertId = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          credentials: 'include', // ⬅️ Kirim cookie HttpOnly
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Sesi login telah berakhir. Silakan login kembali.");
          }
          throw new Error("Gagal mengambil data pengguna.");
        }

        const userData = await response.json();
        if (!userData.success || !userData.data?.id) {
          throw new Error("Data pengguna tidak valid.");
        }

        setExpertId(userData.data.id);
        setError(null);
      } catch (err: any) {
        console.error("Error decoding token atau mengambil data:", err);
        setError(err.message || "Terjadi kesalahan. Silakan login kembali.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpertId();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (expertId) {
      const fetchConsultations = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/consultations`, {
            method: 'GET',
            credentials: 'include', // ⬅️ Gunakan cookie HttpOnly
          });

          if (!response.ok) {
            throw new Error("Gagal mengambil data konsultasi.");
          }

          const data = await response.json();

          const filteredData = data.data
            .filter((consultation: ConsultationData) => consultation.fishExpert_id === expertId)
            .sort((a: ConsultationData, b: ConsultationData) =>
              new Date(b.UserConsultation.createdAt).getTime() - new Date(a.UserConsultation.createdAt).getTime()
            );

          setConsultations(filteredData);
          setError(null);
        } catch (error) {
          console.error("Error fetching consultations:", error);
          setError("Gagal mengambil data konsultasi. Silakan coba lagi.");
        } finally {
          setLoading(false);
        }
      };

      fetchConsultations();
    }
  }, [expertId, API_BASE_URL]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consultations.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle retry fetch
  const handleRetry = () => {
    if (expertId) {
      setLoading(true);
      setError(null);

      const fetchConsultations = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/consultations`);
          if (!response.ok) throw new Error("Failed to fetch consultations");

          const data: ConsultationData[] = await response.json();
          const filteredData = data
            .filter((consultation: ConsultationData) => consultation.fishExpert_id === expertId)
            .sort((a: ConsultationData, b: ConsultationData) =>
              new Date(b.UserConsultation.createdAt).getTime() - new Date(a.UserConsultation.createdAt).getTime()
            );

          setConsultations(filteredData);
          setError(null);
        } catch (error) {
          console.error("Error fetching consultations:", error);
          setError("Gagal mengambil data konsultasi. Silakan coba lagi.");
        } finally {
          setLoading(false);
        }
      };

      fetchConsultations();
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center text-center relative w-full pb-8"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          minHeight: "10vh",
          paddingTop: "5rem",
        }}
      >
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-10 shadow-md"
          aria-label="Informasi status konsultasi"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="text-center px-4 sm:px-0 max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Riwayat Konsultasi Anda
          </h1>
          <h2 className="text-sm sm:text-lg text-[#2C2C2C]">
            Halaman ini menampilkan daftar konsultasi yang pernah Anda tangani sebagai pakar ikan.
          </h2>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          {loading ? (
            <div className="flex justify-center items-center w-full py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center w-full py-20">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : consultations.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-8 my-8 shadow-sm">
              <Image
                src="/images/no-data.svg"
                alt="Tidak ada data"
                width={150}
                height={150}
                className="mb-4"
                unoptimized={true}
              />
              <p className="text-gray-600 text-lg">Belum ada riwayat konsultasi yang Anda tangani.</p>
            </div>
          ) : (
            <>
              {/* Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
                {currentItems.map((consultation) => (
                  <CardRiwayatExpert
                    key={consultation.consultation_id}
                    consultationId={consultation.consultation_id.toString()}
                    userName={consultation.User.name}
                    consultationTopic={consultation.UserConsultation.consultation_topic}
                    complaint={consultation.UserConsultation.complaint}
                    createdAt={consultation.UserConsultation.createdAt}
                    consultationStatus={consultation.consultation_status}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 my-8">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md flex items-center ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span>Prev</span>
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                      // Show first page, current page, last page, and one page before and after current
                      if (
                        number === 1 ||
                        number === totalPages ||
                        number === currentPage ||
                        number === currentPage - 1 ||
                        number === currentPage + 1
                      ) {
                        return (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === number
                                ? 'bg-blue-500 text-white font-medium'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {number}
                          </button>
                        );
                      }

                      // Show ellipsis if needed
                      if (
                        (number === 2 && currentPage > 3) ||
                        (number === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={number} className="w-8 h-8 flex items-center justify-center">...</span>;
                      }

                      return null;
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md flex items-center ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}

              {/* Items per page selector */}
              <div className="flex justify-end items-center text-sm text-gray-500 mb-8">
                <span className="mr-2">Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-white"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
                <span className="ml-2">per halaman</span>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal untuk menampilkan status konsultasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Keterangan Status Konsultasi
            </h3>
            <ul className="space-y-4 text-left text-gray-700">
              <li className="flex items-center gap-3">
                <span className="bg-yellow-300 text-black text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Waiting
                </span>
                <span>Proses pencarian tenaga ahli</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  In Consultation
                </span>
                <span>Sesi konsultasi masih dibuka</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-gray-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Closed
                </span>
                <span>Sesi konsultasi telah berakhir</span>
              </li>
            </ul>
            <button
              onClick={toggleModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}