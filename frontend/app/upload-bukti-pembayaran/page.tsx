"use client";

import { useState, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import SuccessModal from "../components/modals/ModalSuccess";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type BankType = "BCA" | "Mandiri" | "BRI" | "BNI";

const bankAccounts: Record<BankType, { accountNumber: string; holder: string }> = {
  BCA: {
    accountNumber: "123-456-7890",
    holder: "PT. Dokter Ikan",
  },
  Mandiri: {
    accountNumber: "987-654-3210",
    holder: "PT. Dokter Ikan",
  },
  BRI: {
    accountNumber: "456-789-1234",
    holder: "PT. Dokter Ikan",
  },
  BNI: {
    accountNumber: "026-110-7219",
    holder: "REKAYASA AGROMARIN INDONESIA",
  },
};

export default function UploadPaymentProof() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{ accountNumber: string; holder: string } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [, setConsultationId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bank = urlParams.get("bank");
    const consultationId = urlParams.get("consultation_id");
    if (bank && bankAccounts[bank as BankType]) {
      setSelectedBank(bank);
      setBankInfo(bankAccounts[bank as BankType]);
    }
    if (consultationId) {
      setConsultationId(consultationId);
      fetchPaymentId(consultationId);
    }
  }, []);

  const fetchPaymentId = async (consultationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`);
      const data = await response.json();
      if (response.ok && data.data?.payment_id) {
        setPaymentId(data.data.payment_id);
      } else {
        alert("Gagal mendapatkan payment ID.");
      }
    } catch (error) {
      console.error("Error fetching payment ID:", error);
      alert("Terjadi kesalahan saat mendapatkan payment ID.");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setIsUploading(true);

      const response = await fetch(`${API_BASE_URL}/uploadcloudpayment`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Validasi apakah result.images ada dan berbentuk array
        if (Array.isArray(result.data?.images)) {
          setImageUrls((prevImageUrls) => [
            ...prevImageUrls,
            ...result.data.images.map((img: { url: string }) => img.url),
          ]);
        } else {
          console.error("Respons tidak valid: 'images' tidak ditemukan atau bukan array.");
          alert("Upload berhasil, tetapi respons tidak valid.");
        }
      } else {
        alert("Upload gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error saat mengupload:", error);
      alert("Terjadi kesalahan saat mengupload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!paymentId) {
      alert("Payment ID tidak ditemukan.");
      return;
    }

    if (imageUrls.length === 0) {
      alert("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }

    const paymentMethod = selectedBank;
    const paymentProof = imageUrls.join(",");

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: "PUT",
        credentials: "include", // ⬅️ Kirim cookie HttpOnly secara otomatis
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          payment_proof: paymentProof,
          // Backend akan otomatis set payment_status ke 'pending' ketika payment_proof ada
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Tampilkan modal sukses
        setModalOpen(true);
        
        // Optional: Log untuk konfirmasi bahwa status sudah diupdate ke pending
        console.log("Payment updated successfully. Status should now be 'pending'");
        
        // Optional: Bisa tambahkan notifikasi sukses yang lebih detail
        // alert("Bukti pembayaran berhasil dikirim! Status pembayaran telah diubah menjadi pending.");
      } else {
        const message = result?.message || "Gagal mengupdate pembayaran.";
        alert(`Gagal mengupdate pembayaran: ${message}`);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Terjadi kesalahan saat mengupdate pembayaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedBank || !bankInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Bank Tidak Ditemukan</h2>
          <p className="text-gray-700">Harap pilih bank terlebih dahulu untuk melanjutkan proses pembayaran.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-700 mb-4">Upload Bukti Pembayaran</h2>
        <p className="text-gray-700 text-sm sm:text-base text-center mb-8">
          Silakan unggah bukti pembayaran Anda untuk bank{" "}
          <span className="font-semibold text-blue-600">{selectedBank}</span>.
        </p>

        <div className="mb-6">
          <h3 className="text-base sm:text-base font-semibold text-blue-700">Informasi Rekening</h3>
          <p className="text-gray-700 text-sm">Silakan transfer ke rekening berikut:</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <p className="text-sm text-gray-700">
              No. Rekening: <span className="font-semibold text-gray-900">{bankInfo.accountNumber}</span>
            </p>
            <p className="text-sm text-gray-700">
              Atas Nama: <span className="font-semibold text-gray-900">{bankInfo.holder}</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bukti Pembayaran</label>
          <div className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*, .pdf"
              multiple
              className="hidden"
              id="paymentProof"
              onChange={handleFileChange}
              disabled={isUploading || isSubmitting}
            />
            <label
              htmlFor="paymentProof"
              className={`cursor-pointer flex items-center space-x-3 ${
                isUploading || isSubmitting 
                  ? "text-gray-400" 
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <PaperClipIcon className="h-6 w-6" />
              <span className="text-sm">
                {isUploading 
                  ? "Sedang mengupload..." 
                  : "Klik untuk memilih file"
                }
              </span>
            </label>
            {isUploading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Format yang didukung: JPG, PNG, PDF. Maksimal beberapa file sekaligus.
          </p>
        </div>

        {imageUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Bukti Pembayaran yang Diupload ({imageUrls.length}):
            </h3>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Bukti Pembayaran ${index + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-auto max-h-60 object-contain bg-gray-50"
                    unoptimized={true}
                  />
                  <div className="p-2 bg-gray-50">
                    <p className="text-xs text-gray-600">File {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handlePaymentUpdate}
          disabled={isUploading || isSubmitting || imageUrls.length === 0}
          className={`w-full py-3 mt-6 text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
            isUploading || isSubmitting || imageUrls.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
          }`}
        >
          {isSubmitting 
            ? "Sedang Memproses..." 
            : isUploading 
            ? "Sedang Mengupload..." 
            : "Kirim Bukti Pembayaran"
          }
        </button>

        {imageUrls.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Silakan upload bukti pembayaran terlebih dahulu
          </p>
        )}
      </div>
      
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setModalOpen(false);
          // Optional: Redirect ke halaman lain setelah sukses
          // window.location.href = '/payment-status';
        }} 
      />
    </div>
  );
}