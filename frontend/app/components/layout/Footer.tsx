import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [showAdminContact, setShowAdminContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: ''
  });

  // Social media links
  const socialLinks = {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com"
  };

  // Admin WhatsApp number
  const adminWhatsApp = "6282133513522"; // Format without + sign

  // Modal content for FAQ, Terms, and Privacy
  const contentTypes = {
    faq: {
      title: 'Frequently Asked Questions',
      content: `
        <h3 class="font-bold text-lg mb-2">Apa itu layanan Dokter Ikan?</h3>
        <p class="mb-4">Dokter Ikan adalah layanan konsultasi online yang menghubungkan pembudidaya ikan dengan tenaga ahli perikanan untuk mendiagnosis dan mengatasi masalah kesehatan ikan.</p>
        
        <h3 class="font-bold text-lg mb-2">Bagaimana cara menggunakan platform ini?</h3>
        <p class="mb-4">Anda dapat mendaftar akun, mengisi form konsultasi dengan deskripsi masalah dan foto (jika ada), kemudian akan dihubungkan dengan tenaga ahli yang sesuai.</p>
        
        <h3 class="font-bold text-lg mb-2">Berapa biaya untuk berkonsultasi?</h3>
        <p class="mb-4">Biaya konsultasi bervariasi tergantung kompleksitas masalah dan ahli yang ditugaskan. Detail biaya akan ditampilkan sebelum Anda melakukan konfirmasi konsultasi.</p>
        
        <h3 class="font-bold text-lg mb-2">Apakah layanan ini tersedia 24 jam?</h3>
        <p class="mb-4">Layanan konsultasi tersedia setiap hari dengan jam operasional 08.00-17.00 WIB. Konsultasi di luar jam tersebut akan diproses pada hari kerja berikutnya.</p>
        
        <h3 class="font-bold text-lg mb-2">Bagaimana jika saya ingin menjadi tenaga ahli?</h3>
        <p>Anda dapat mendaftar sebagai tenaga ahli dengan mengklik tombol "Daftar" di bagian bawah halaman dan mengikuti prosedur verifikasi.</p>
      `
    },
    terms: {
      title: 'Syarat dan Ketentuan',
      content: `
        <h3 class="font-bold text-lg mb-2">1. Ketentuan Umum</h3>
        <p class="mb-4">Dengan mengakses dan menggunakan layanan Dokter Ikan, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang berlaku. Jika Anda tidak menyetujui syarat dan ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.</p>
        
        <h3 class="font-bold text-lg mb-2">2. Layanan Konsultasi</h3>
        <p class="mb-4">Konsultasi yang diberikan oleh tenaga ahli bersifat anjuran profesional dan tidak menggantikan penanganan langsung oleh dokter hewan atau ahli perikanan di lokasi budidaya.</p>
        
        <h3 class="font-bold text-lg mb-2">3. Pembayaran</h3>
        <p class="mb-4">Pembayaran dilakukan melalui metode yang tersedia dalam platform. Biaya tidak dapat dikembalikan setelah konsultasi dimulai, kecuali terjadi kendala teknis dari pihak kami.</p>
        
        <h3 class="font-bold text-lg mb-2">4. Kewajiban Pengguna</h3>
        <p class="mb-4">Pengguna wajib memberikan informasi yang akurat dan lengkap terkait kondisi ikan dan lingkungan budidaya. Informasi yang tidak akurat dapat memengaruhi kualitas konsultasi.</p>
        
        <h3 class="font-bold text-lg mb-2">5. Perubahan Ketentuan</h3>
        <p>PT Rekayasa Agromarin Indonesia berhak mengubah syarat dan ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Pengguna disarankan untuk memeriksa halaman ini secara berkala.</p>
      `
    },
    privacy: {
      title: 'Kebijakan Privasi',
      content: `
        <h3 class="font-bold text-lg mb-2">1. Pengumpulan Data</h3>
        <p class="mb-4">Kami mengumpulkan informasi personal yang Anda berikan saat mendaftar, melakukan konsultasi, atau berkomunikasi dengan kami, termasuk nama, alamat email, nomor telepon, dan data terkait budidaya ikan.</p>
        
        <h3 class="font-bold text-lg mb-2">2. Penggunaan Data</h3>
        <p class="mb-4">Data yang dikumpulkan digunakan untuk menyediakan dan meningkatkan layanan konsultasi, menghubungkan Anda dengan tenaga ahli yang sesuai, serta untuk keperluan administratif dan komunikasi.</p>
        
        <h3 class="font-bold text-lg mb-2">3. Keamanan Data</h3>
        <p class="mb-4">Kami menerapkan langkah-langkah keamanan untuk melindungi data Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran informasi yang tidak diizinkan.</p>
        
        <h3 class="font-bold text-lg mb-2">4. Pembagian Informasi</h3>
        <p class="mb-4">Kami tidak akan menjual, memperdagangkan, atau menyewakan informasi personal Anda kepada pihak ketiga tanpa persetujuan Anda. Informasi mungkin dibagikan dengan tenaga ahli yang relevan untuk keperluan konsultasi.</p>
        
        <h3 class="font-bold text-lg mb-2">5. Persetujuan</h3>
        <p>Dengan menggunakan layanan kami, Anda menyetujui kebijakan privasi ini dan pengumpulan serta penggunaan informasi Anda sesuai dengan ketentuan yang berlaku.</p>
      `
    }
  };

  const handleRegisterClick = () => {
    setShowAdminContact(true);
  };

  const handleCloseModal = () => {
    setShowAdminContact(false);
    setShowModal(false);
  };
  
  const handleContentClick = (type: keyof typeof contentTypes) => {
    setModalContent({
      title: contentTypes[type].title,
      content: contentTypes[type].content,
    });
    setShowModal(true);
  };

  return (
    <footer className="bg-white p-6 text-center font-sans relative">
      <div className="bg-[rgba(105,203,244,0.26)] p-8 rounded-lg shadow-lg mx-4">
        <div className="flex flex-col items-start md:flex-row md:items-start md:ml-16">
          <div className="flex items-center md:mb-0 ml-[-4px] md:ml-[-20px]">
            <Image src="/images/logo/logo_fdokterikan.png" alt="Home Icon" width={96} height={64} className="w-28 h-10 md:w-40 md:h-16" />
          </div>
        </div>

        {/* Kolom Teks */}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-20 lg:gap-60 mb-4">
          <div className="text-left mb-4 md:mb-0 md:ml-12 mt-4">
            <p className="text-black text-sm sm:text-base font-semibold mb-4">Site Map</p>
            <p 
              className="text-black text-xs sm:text-sm mb-2 cursor-pointer hover:text-blue-600 transition"
              onClick={() => handleContentClick('faq')}
            >
              FAQ
            </p>
            <p 
              className="text-black text-xs sm:text-sm mb-2 cursor-pointer hover:text-blue-600 transition"
              onClick={() => handleContentClick('terms')}
            >
              Syarat dan Ketentuan
            </p>
            <p 
              className="text-black text-xs sm:text-sm cursor-pointer hover:text-blue-600 transition"
              onClick={() => handleContentClick('privacy')}
            >
              Kebijakan Privasi
            </p>
          </div>
          <div className="text-left mb-8 sm:mb-4 md:mb-0 mt-4">
            <p className="text-black text-sm sm:text-base font-semibold mb-4">Layanan Pengaduan</p>
            <p className="text-black font-semibold text-xs sm:text-sm mb-2">PT Rekayasa Agromarin Indonesia</p>
            <p className="text-black text-xs sm:text-sm mb-2">Citra Onyx, c22 Tanjung Uban Selatan, Bintan, Kepulauan Riau</p>
            <p className="text-black text-xs sm:text-sm">rekayasaagromarin@gmail.com / 08117775353</p>
          </div>
          <div className="text-left mb-4 md:mb-0 -mt-4">
            <p className="text-black font-semibold text-sm">Kolaborasi dengan:</p>
            <div className="flex gap-2 mb-4">
              <Image src="/images/logo/logo_undip.png" alt="Partner 1" width={50} height={20} className="w-12 h-12" />
              <Image src="/images/logo/logo_cemebsacut.png" alt="Partner 2" width={120} height={50} className="w-30 h-12" />
              <Image src="/images/logo/logo_RAI.png" alt="Partner 3" width={50} height={50} className="w-12 h-12" />
            </div>
            <p className="text-black text-sm font-semibold -mt-1">Follow Us:</p>
            <div className="flex gap-4 mb-4">
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Image src="/images/icon/ic_twitter.png" alt="Twitter" width={24} height={24} className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Image src="/images/icon/ic_instagram.png" alt="Instagram" width={24} height={24} className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Image src="/images/icon/ic_facebook.png" alt="Facebook" width={24} height={24} className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <Image src="/images/icon/ic_youtube.png" alt="YouTube" width={24} height={24} className="w-6 h-6 hover:opacity-80 transition" />
              </a>
            </div>
            <p className="text-black font-semibold text-sm">Apakah Anda Tenaga Ahli Ikan?</p>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition mt-1"
              onClick={handleRegisterClick}
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Teks Tambahan */}
        <div className="mt-6 text-black font-semibold text-xs sm:text-sm text-center">
          <p>
            <span className="font-bold">PT Rekayasa Agromarin Indonesia</span> | All Rights Reserved 2024
          </p>
        </div>
      </div>
      
      {/* Modal Admin Contact */}
      {showAdminContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Hubungi Admin</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">Silakan hubungi admin kami untuk mendaftarkan diri sebagai tenaga ahli ikan.</p>
            <div className="flex justify-center">
              <a 
                href={`https://wa.me/${adminWhatsApp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.8 12 2.8s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z"></path>
                </svg>
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for FAQ, Terms, and Privacy Policy */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
              <h3 className="text-xl font-bold text-gray-800">{modalContent.title}</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: modalContent.content }}
            />
          </div>
        </div>
      )}
    </footer>
  );
}