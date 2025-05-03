// WelcomeModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    const [, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Tunggu animasi selesai
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="bg-gradient-to-r from-[#0078D4] to-[#005EA6] p-4">
                    <h2 className="text-white text-xl font-bold text-center">Aturan Konsultasi Ikan</h2>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-[#005EA6] font-bold text-lg mb-2">Informasi Biaya</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-[#BCEBFF]">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-800">Konsultasi Dasar:</span>
                                <span className="font-bold text-gray-900">Rp 20.000</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-800">Aktifkan Fitur Chat:</span>
                                <span className="font-bold text-gray-900">Rp 50.000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-800">Obat dan Pengiriman:</span>
                                <span className="font-bold text-gray-900">Menyesuaikan</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">*Biaya akan ditagihkan setelah konsultasi selesai</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-[#005EA6] font-bold text-lg mb-2">Petunjuk Konsultasi</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-800">
                            <li>Berikan informasi lengkap tentang ikan (jenis, ukuran, umur)</li>
                            <li>Deskripsikan gejala atau perubahan perilaku dengan jelas</li>
                            <li>Unggah foto ikan dari berbagai sudut untuk diagnosis lebih akurat</li>
                            <li>Sebutkan kondisi air dan lingkungan pemeliharaan</li>
                            <li>Sertakan riwayat penyakit atau perawatan sebelumnya jika ada</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-[#005EA6] font-bold text-lg mb-2">Waktu Respons</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-[#BCEBFF]">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-800">Konsultasi Dasar:</span>
                                <span className="text-gray-900">1-6 jam</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-800">Fitur Chat:</span>
                                <span className="text-gray-900">1-2 jam</span>
                            </div>
                           
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-[#005EA6] font-bold text-lg mb-2">Ketentuan Layanan</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-800">
                            <li>Satu konsultasi mencakup satu jenis masalah untuk satu jenis ikan</li>
                            <li>Tenaga Ahli ikan berhak meminta informasi tambahan jika diperlukan</li>
                            <li>Pembatalan konsultasi dapat dilakukan sebelum ahli memberikan respons</li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    className="p-4 bg-gray-50 border-t flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.button
                        onClick={handleClose}
                        className="bg-gradient-to-r from-[#0078D4] to-[#005EA6] text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Saya Mengerti
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeModal;