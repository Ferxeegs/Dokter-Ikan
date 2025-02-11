"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation"; // Import useRouter dari next/navigation

interface DetailResepProps {
  isOpen: boolean;
  toggleModal: () => void;
  consultationId: string;
}

interface Medicine {
  id: number;
  title: string;
  content: string;
  dose: string;
  image: string;
  price: number;
}

const CONSULTATION_FEE = 50000;
const CHAT_FEE = 25000;

const DetailResep: React.FC<DetailResepProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [prescriptionData, setPrescriptionData] = useState<Medicine[]>([]);
  const [instruction, setInstruction] = useState<string>("");
  const [prescriptionId, setPrescriptionId] = useState<number | null>(null);
  const [chatEnabled, setChatEnabled] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // State untuk loading

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isMounted = useRef<boolean>(false);
  const router = useRouter(); // Menggunakan useRouter dari next/navigation

  useEffect(() => {
    isMounted.current = true;

    const fetchPrescriptionData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/prescriptionsbyconsultation?consultation_id=${consultationId}`);
        if (!response.ok) throw new Error("Failed to fetch prescription data");
        const data = await response.json();

        if (isMounted.current) {
          setInstruction(data?.instruction || "");
          setPrescriptionId(data?.prescription_id || null);
          setPrescriptionData(Array.isArray(data?.medicines) ? data.medicines : []);
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    const fetchConsultationData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`);
        if (!response.ok) throw new Error("Failed to fetch consultation data");
        const data = await response.json();

        console.log("chat_enabled type:", typeof data?.chat_enabled, "value:", data?.chat_enabled);

        if (isMounted.current) {
          setChatEnabled(data?.chat_enabled === true || data?.chat_enabled === "true");
          setTitle(data?.title || "");
        }
      } catch (error) {
        console.error("Error fetching consultation data:", error);
      }
    };

    if (isOpen && consultationId) {
      fetchPrescriptionData();
      fetchConsultationData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [isOpen, consultationId, API_BASE_URL]);

  const totalFee = useMemo(() => {
    const medicineTotal = prescriptionData.reduce((sum, med) => sum + med.price, 0);
    return medicineTotal + CONSULTATION_FEE + (chatEnabled ? CHAT_FEE : 0);
  }, [prescriptionData, chatEnabled]);

  const handlePayment = async () => {
    if (!prescriptionId) {
      alert("Gagal mendapatkan ID resep.");
      return;
    }

    setIsProcessing(true); // Set state isProcessing agar tombol menampilkan "Memproses..."

    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultation_id: consultationId,
          prescription_id: prescriptionId,
          total_fee: totalFee,
          payment_status: "pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate payment");
      // Tunggu 2 detik sebelum mengarahkan ke halaman pembayaran
      setTimeout(() => {
        router.push(`/payment?consultation_id=${consultationId}`);
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] md:w-[40%] relative overflow-y-auto max-h-[80vh] flex flex-col shadow-lg transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">{'🩺 Resep Obat dari Tenaga Ahli'}</h2>

        <div className="bg-blue-100 p-4 rounded-lg mb-4 shadow-md flex items-start gap-3">
          <span className="text-blue-600 text-xl">📌</span>
          <div>
            <h3 className="font-semibold text-blue-800">Instruksi Penggunaan</h3>
            <p className="text-gray-700 text-sm">{instruction ? instruction : "Tidak ada instruksi penggunaan."}</p>
          </div>
        </div>

        <div className="font-sans space-y-4 mb-6">
          {prescriptionData.length > 0 ? (
            prescriptionData.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Gambar Tidak Tersedia</span>
                  )}
                </div>
                <div className="ml-4 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.content}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.dose}</p>
                  <p className="text-sm font-semibold text-gray-800">Harga: Rp{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">Tidak ada resep untuk konsultasi ini.</p>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`text-center mt-auto py-2 px-4 rounded-full shadow-lg transition duration-300 ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isProcessing ? "Memproses..." : "Ke menu pembayaran"}
        </button>
      </div>
    </div>
  );
};

export default DetailResep;
