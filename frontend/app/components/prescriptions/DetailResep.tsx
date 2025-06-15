"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

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

const CONSULTATION_FEE = 20000;
const CHAT_FEE = 10000;

const DetailResep: React.FC<DetailResepProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [prescriptionData, setPrescriptionData] = useState<Medicine[]>([]);
  const [instruction, setInstruction] = useState<string>("");
  const [prescriptionId, setPrescriptionId] = useState<number | null>(null);
  const [chatEnabled, setChatEnabled] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isMounted = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen || !consultationId || !API_BASE_URL) return;
    isMounted.current = true;

    const fetchPrescriptionData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/prescriptionsbyconsultation?consultation_id=${consultationId}`);
        if (!response.ok) throw new Error("Gagal mengambil data resep");
        const data = await response.json();

        if (isMounted.current) {
          setInstruction(data.data?.instruction || "");
          setPrescriptionId(data.data?.prescription_id || null);
          setPrescriptionData(Array.isArray(data.data?.medicines) ? data.data.medicines : []);
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    const fetchConsultationData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`);
        if (!response.ok) throw new Error("Gagal mengambil data konsultasi");
        const data = await response.json();

        if (isMounted.current) {
          setChatEnabled(data.data?.chat_enabled === true || data.data?.chat_enabled === "true");
        }
      } catch (error) {
        console.error("Error fetching consultation data:", error);
      }
    };

    fetchPrescriptionData();
    fetchConsultationData();

    return () => {
      isMounted.current = false;
    };
  }, [isOpen, consultationId, API_BASE_URL]);

  const totalFee = useMemo(() => {
    const medicineTotal = prescriptionData.reduce((sum, med) => sum + med.price, 0);
    return medicineTotal + CONSULTATION_FEE + (chatEnabled ? CHAT_FEE : 0);
  }, [prescriptionData, chatEnabled]);

  const handlePayment = async () => {
    setIsProcessing(true);
  
    try {
      const paymentLookupResponse = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`);
      const paymentLookupData = await paymentLookupResponse.json();
  
      if (
        paymentLookupResponse.ok &&
        paymentLookupData.success &&
        paymentLookupData.message !== "Payment not found for this consultation"
      ) {
        // Jika pembayaran ditemukan, langsung redirect
        router.push(`/payment?consultation_id=${consultationId}`);
      } else if (
        paymentLookupData.success === false &&
        paymentLookupData.message === "Payment not found for this consultation"
      ) {
        // Jika belum ada pembayaran, buat baru
        const response = await fetch(`${API_BASE_URL}/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consultation_id: consultationId,
            prescription_id: prescriptionId || null,
            total_fee: totalFee,
            payment_status: "unpaid",
          }),
        });
  
        if (!response.ok) throw new Error("Gagal memulai pembayaran");
  
        // Redirect setelah berhasil
        setTimeout(() => {
          router.push(`/payment?consultation_id=${consultationId}`);
        }, 2000);
      } else {
        throw new Error("Gagal memeriksa data pembayaran");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] md:w-[40%] relative overflow-hidden max-h-[80vh] flex flex-col shadow-lg transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">{'🩺 Resep Obat dari Tenaga Ahli'}</h2>

        <div className="bg-blue-100 p-4 rounded-lg mb-4 shadow-md flex items-start gap-3">
          <span className="text-blue-600 text-xl">📌</span>
          <div>
            <h3 className="font-semibold text-blue-800">Instruksi Penggunaan</h3>
            <p className="text-gray-700 text-sm">{instruction || "Tidak ada instruksi penggunaan."}</p>
          </div>
        </div>

        <div className="font-sans space-y-4 mb-6 overflow-y-auto max-h-60">
          {prescriptionData.length > 0 ? (
            prescriptionData.map((item, index) => (
              <div
                key={item.id ?? `medicine-${index}`}
                className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow transition-transform duration-300"
              >
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} width={80} height={80} className="object-cover rounded-lg" unoptimized={true} />
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
          className={`text-center mt-auto py-2 px-4 rounded-full shadow-lg transition duration-300 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          {isProcessing ? "Memproses..." : "Ke menu pembayaran"}
        </button>
      </div>
    </div>
  );
};

export default DetailResep;