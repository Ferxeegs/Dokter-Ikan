import Navbar from './../components/navbar';
import Footer from './../components/footer';

export default function DiseaseDetection() {
  return (
    <div
      className="flex flex-col min-h-screen"
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

      {/* Main Content */}
      <div className="flex-grow items-center justify-center px-8 py-12 text-center">
        {/* Title and Subtitle */}
        <div className="ml-6 mt-28">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Deteksi Spesies Ikan dengan AI
          </h1>
          <h2 className="text-lg mb-6 text-[#2C2C2C]">
            Unggah foto ikan, dan teknologi AI kami akan menganalisis spesies serta penyakit yang mungkin diderita
          </h2>
        </div>

        {/* Boxes Section */}
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20">
          {/* Box 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex-1 max-w-md border-2 border-blue-500">
            <h2 className="text-2xl font-semibold text-center text-gray-700">Gejala Fisik</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-[#D2EFFC] text-gray-700 rounded hover:bg-blue-300"
                >
                  Option {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex-1 max-w-md border-2 border-blue-500">
            <h2 className="text-2xl font-semibold text-center text-gray-700">Gejala Perilaku</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-[#D2EFFC] text-gray-700 rounded hover:bg-blue-300"
                >
                  Action {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Button with Icon */}
        <div className="mt-12 flex justify-center">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#1A83FB] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {/* Icon (example: SVG or Font Awesome icon) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            Periksa Penyakit
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
