'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, LogIn } from "lucide-react";

// Menambahkan tipe untuk data konsultasi yang mencakup hasil join dari beberapa tabel
interface Consultation {
  consultation_id: number;
  user_consultation_id: number;
  fishExpert_id: number | null;
  fish_expert_answer_id: number | null;
  consultation_status: string;

  // Data dari tabel UserConsultation
  fish_type_id: number;
  fish_age: string;
  fish_length: string;
  consultation_topic: string;
  fish_image: string;
  complaint: string;
  created_at: string;

  // Data dari tabel FishExpert
  fish_expert_name: string | null;
  fish_expert_specialization: string | null;

  // Data dari tabel FishExpertAnswer
  fish_expert_answer: string | null;
  fish_expert_answer_created_at: string | null;
}

interface UserFromToken {
  id: number;
  name: string;
}

interface ApiResponseItem {
  consultation_id: number;
  user_consultation_id: number;
  fishExpert_id: number | null;
  fish_expert_answer_id: number | null;
  consultation_status: string;
  "UserConsultation.fish_type_id": number;
  "UserConsultation.fish_age": string;
  "UserConsultation.fish_length": string;
  "UserConsultation.consultation_topic": string;
  "UserConsultation.fish_image": string;
  "UserConsultation.complaint": string;
  "UserConsultation.created_at": string;
  "FishExpert.name": string | null;
  "FishExpert.specialization": string | null;
  "FishExpertAnswer.answer": string | null;
  "FishExpertAnswer.created_at": string | null;
}

export default function CardRiwayat() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Ambil token dari cookies
  const getCurrentUser = useCallback(async (): Promise<UserFromToken | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error("Error verifying user:", error);
      return null;
    }
  }, [API_BASE_URL]);

  const fetchConsultations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/consultation`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 404 && data.message === "Belum ada riwayat konsultasi.") {
        setConsultations([]);
        setError(null);
        return;
      }

      if (response.ok && data.data) {
        const transformedData = data.data.map((item: ApiResponseItem) => ({
          consultation_id: item.consultation_id,
          user_consultation_id: item.user_consultation_id,
          fishExpert_id: item.fishExpert_id,
          fish_expert_answer_id: item.fish_expert_answer_id,
          consultation_status: item.consultation_status,

          fish_type_id: item["UserConsultation.fish_type_id"],
          fish_age: item["UserConsultation.fish_age"],
          fish_length: item["UserConsultation.fish_length"],
          consultation_topic: item["UserConsultation.consultation_topic"],
          fish_image: item["UserConsultation.fish_image"],
          complaint: item["UserConsultation.complaint"],
          created_at: item["UserConsultation.created_at"],

          fish_expert_name: item["FishExpert.name"],
          fish_expert_specialization: item["FishExpert.specialization"],

          fish_expert_answer: item["FishExpertAnswer.answer"],
          fish_expert_answer_created_at: item["FishExpertAnswer.created_at"],
        }));

        transformedData.sort((a : Consultation, b : Consultation) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setConsultations(transformedData);
        setError(null);
      } else {
        setConsultations([]);
        setError(data.message || `Error: ${response.statusText}`);
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mengambil data konsultasi.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const user = await getCurrentUser();

      if (!user) {
        setIsLoggedIn(false);
        setLoading(false);
        router.push("/login");
        return;
      }

      setIsLoggedIn(true);
      setUserName(user.name);
      await fetchConsultations();
    };

    init();
  }, [getCurrentUser, fetchConsultations, router]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-300 text-black";
      case "In Consultation":
        return "bg-green-400 text-white";
      case "Closed":
        return "bg-gray-400 text-white";
      default:
        return "bg-blue-400 text-white";
    }
  };

  const handleCardClick = (consultationId: number) => {
    router.push(`/consultation?id=${consultationId}`);
  };

  const handleLogin = () => {
    router.push('/login');
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Tidak login
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-8 my-8 shadow-sm">
        <div className="bg-blue-100 p-3 rounded-full mb-4">
          <LogIn className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Anda belum login</h2>
        <p className="text-gray-600 text-center mb-4">Silakan login terlebih dahulu untuk melihat riwayat konsultasi.</p>
        <button 
          onClick={handleLogin} 
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition shadow"
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  // Error state - tetapi hindari menampilkan error untuk kasus "Belum ada riwayat konsultasi"
  if (error && error !== "Belum ada riwayat konsultasi.") {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
          <p>{error}</p>
          <button 
            onClick={() => fetchConsultations()} 
            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {consultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-8 my-8 shadow-sm">
          <Image 
            src="/images/icon/ic_nodata.svg" 
            alt="Tidak ada data" 
            width={150} 
            height={150} 
            className="mb-4" 
            unoptimized={true}
          />
          <h2 className="text-base text-gray-800 mb-2">Belum Ada Riwayat Konsultasi</h2>
          <button 
            onClick={() => router.push('/userpost')} 
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition shadow"
          >
            Mulai Konsultasi Baru
          </button>
        </div>
      ) : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
            {currentItems.map((consultation) => (
              <button
                key={consultation.user_consultation_id}
                className="relative overflow-hidden flex flex-col bg-white border-l-4 border-blue-400 text-left px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition group h-full"
                style={{ borderLeftWidth: '6px' }}
                onClick={() => handleCardClick(consultation.consultation_id)}
              >
                {/* Status Badge */}
                <span className={`absolute top-3 right-3 text-xs font-semibold italic px-3 py-1 rounded-full ${getStatusColor(consultation.consultation_status)}`}>
                  {consultation.consultation_status}
                </span>
                
                {/* User Info */}
                <div className="flex items-center mb-4 mt-1">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{userName || "Loading..."}</p>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{formatDate(consultation.created_at)}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{formatTime(consultation.created_at)} WIB</span>
                </div>
                
                {/* Topic & Complaint */}
                <div className="flex-grow">
                  <h2 className="text-base font-bold text-blue-600 mb-2 line-clamp-1">
                    {consultation.consultation_topic}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {consultation.complaint || "Keluhan tidak tersedia"}
                  </p>
                </div>
                
                {/* View Details Button */}
                <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                  <span className="text-xs text-blue-500 group-hover:underline flex items-center">
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 my-8">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === number
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
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
  );
}