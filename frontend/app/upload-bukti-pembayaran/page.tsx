"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaperClipIcon } from '@heroicons/react/20/solid';
import SuccessModal from "../components/modals/ModalSuccess"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Gantilah dengan URL API Anda

// Menyatakan tipe bank dengan union type
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
    accountNumber: "321-654-9876",
    holder: "PT. Dokter Ikan",
  }
};

export default function UploadPaymentProof() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{ accountNumber: string, holder: string } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Menyimpan URL gambar yang diupload
  const [consultationId, setConsultationId] = useState<string | null>(null); // Menyimpan consultationId
  const [paymentId, setPaymentId] = useState<string | null>(null); // Menyimpan paymentId
  const [isModalOpen, setModalOpen] = useState(false); // State untuk modal
  const router = useRouter();

  // Mengambil query parameter bank dan consultationId dari URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bank = urlParams.get("bank");
    const consultationId = urlParams.get("consultation_id"); // Mendapatkan consultationId dari query string
    if (bank && bankAccounts[bank as BankType]) {
      setSelectedBank(bank);
      setBankInfo(bankAccounts[bank as BankType]);
    }
    if (consultationId) {
      setConsultationId(consultationId); // Menyimpan consultationId
      fetchPaymentId(consultationId); // Mendapatkan paymentId berdasarkan consultationId
    }
  }, []);

  const fetchPaymentId = async (consultationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`);
      const data = await response.json();
      if (response.ok && data.payment_id) {
        setPaymentId(data.payment_id);
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

    console.log("Selected files:", Array.from(files).map((file) => file.name));

    const formData = new FormData();
    // Tambahkan semua file ke FormData
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Gabungkan filePaths baru dengan filePaths yang sudah ada
        setImageUrls((prevImageUrls) => [...prevImageUrls, ...result.filePaths]); // Menambahkan file baru
      } else {
        alert("Upload gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error saat mengupload:", error);
      alert("Terjadi kesalahan saat mengupload.");
    }
  };

  const handlePaymentUpdate = async () => {
    if (!paymentId) {
      alert("Payment ID tidak ditemukan.");
      return;
    }

    const paymentMethod = selectedBank; // Menggunakan bank yang dipilih sebagai metode pembayaran
    const paymentProof = imageUrls.join(","); // Menggunakan URL gambar sebagai bukti pembayaran
  
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      method: "PUT", // Menggunakan PATCH atau PUT untuk update data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method: paymentMethod,
        payment_proof: paymentProof,
      }),
    });
  
    const result = await response.json();
    if (response.ok) {
      setModalOpen(true); // Tampilkan modal saat pembayaran berhasil diperbarui
    } else {
      alert(`Gagal mengupdate pembayaran: ${result.message}`);
    }
  };

  if (!selectedBank || !bankInfo) {
    return <div>Bank tidak ditemukan. Harap pilih bank terlebih dahulu.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Upload Bukti Pembayaran</h2>
        <p className="text-gray-700 text-center mb-8">Silakan unggah bukti pembayaran Anda untuk bank <span className="font-semibold text-blue-600">{selectedBank}</span>.</p>

        {/* Keterangan Bank */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-700">Informasi Rekening</h3>
          <p className="text-gray-700 text-sm">Silakan transfer ke rekening berikut:</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <p className="text-sm text-gray-700">No. Rekening: <span className="font-semibold text-gray-900">{bankInfo.accountNumber}</span></p>
            <p className="text-sm text-gray-700">Atas Nama: <span className="font-semibold text-gray-900">{bankInfo.holder}</span></p>
          </div>
        </div>

        {/* Form Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bukti Pembayaran</label>
          <div className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*, .pdf"
              className="hidden"
              id="paymentProof"
              onChange={handleFileChange}
            />
            <label htmlFor="paymentProof" className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center space-x-3">
              <PaperClipIcon className="h-6 w-6" />
              <span className="text-sm">Klik untuk memilih file</span>
            </label>
          </div>
        </div>

        {/* Menampilkan file yang diupload */}
        {imageUrls.length > 0 && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Bukti Pembayaran yang Diupload:</h3>
            <ul className="space-y-2">
            {imageUrls.map((url, index) => (
                <li key={index} className="text-sm text-gray-700">
                {/* Menampilkan gambar jika URL gambar ada */}
                <img src={`${API_BASE_URL}${url}`} alt={`Uploaded Image ${index + 1}`} className="w-full h-auto rounded-lg" />
                </li>
            ))}
            </ul>
        </div>
        )}

        <button
          onClick={handlePaymentUpdate} // Menggunakan handlePaymentUpdate untuk mengupdate data pembayaran
          className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kirim Bukti Pembayaran
        </button>
      </div>
      <SuccessModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} /> {/* Tambahkan komponen modal */}
    </div>
  );
}