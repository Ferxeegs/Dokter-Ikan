"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
}

const bankAccounts = [
  { bank: "BNI", accountNumber: "026-110-7219", holder: "REKAYASA AGROMARIN INDONESIA", logo: "/images/logo/logo_BNI.png" }
];

export default function PaymentModal({ isOpen, onClose, consultationId }: PaymentModalProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Nomor rekening telah disalin!');
    });
  };

  const handleBankSelection = (bank: string) => {
    setSelectedBank(bank);
  };

  const handleSendPaymentProof = () => {
    if (selectedBank) {
      router.push(`/upload-bukti-pembayaran?bank=${selectedBank}&consultation_id=${consultationId}`);
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'modal-overlay') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      onClick={handleCloseModal}
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Transfer Bank</h2>
        <p className="text-gray-600 text-center mb-4">Silakan transfer ke salah satu rekening berikut:</p>

        <div className="space-y-4">
          {bankAccounts.map((bank, index) => (
            <div
              key={index}
              className={`p-4 ${selectedBank === bank.bank ? 'bg-blue-200' : 'bg-blue-50'} border border-blue-300 rounded-xl shadow-sm flex items-center justify-between cursor-pointer`}
              onClick={() => handleBankSelection(bank.bank)}
            >
              <div className="flex items-center space-x-3">
                <Image src={bank.logo} alt={`${bank.bank} Logo`} width={48} height={48} className="object-contain" />
                <div>
                  <p className="text-lg font-semibold text-blue-700">{bank.bank}</p>
                  <p className="text-gray-700 text-sm">
                    No. Rekening:{" "}
                    <span className="font-medium text-gray-900">{bank.accountNumber}</span>
                  </p>
                  <p className="text-gray-700 text-sm">
                    Atas Nama: <span className="font-normal text-gray-900">{bank.holder}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bank.accountNumber)}
                className="text-xs text-blue-600 hover:underline"
              >
                Salin
              </button>
            </div>
          ))}
        </div>

        <button
          className={`mt-4 w-full py-3 rounded-xl shadow-md transition ${selectedBank ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          onClick={selectedBank ? handleSendPaymentProof : undefined}
        >
          {selectedBank ? "Kirim Bukti Pembayaran" : "Pilih Salah Satu Bank"}
        </button>
      </div>
    </div>
  );
}