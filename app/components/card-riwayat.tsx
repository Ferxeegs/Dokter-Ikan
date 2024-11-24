export default function CardRiwayat() {
    return (
        <button className="flex flex-col bg-white border-blue-300  border-4 text-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition w-5/12 mr-9">
            <div className="flex flex-row ">
              <img src="/profil.png" alt="Konsultasi Icon" className="w-16 h-16 mb-4 rounded-full mr-4 bg-blue-400" />
              <div className="flex flex-col text-black text-xs justify-center text-left min-w-32">
                <p className="font-bold text-sm">Ferdianz</p>
                <p className="font-lato">21 November 2024</p>
                <p className="font-lato">13.00 WIB</p>
              </div>
              <span className="flex items-center justify-center my-auto text-sm text-black font-semibold italic ml-32 bg- w-56 h-8 rounded-3xl text-center bg-blue-200">
                belum selesai
              </span>
            </div>
            <div className="text-right text-black font-bold mt-4 ml-20">
              <h1 className="text-lg" >Saya kok ganteng banget kenapa, ya?</h1>
              <p className="text-justify text-sm font-thin text-black  mt-1 ">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.
              </p>
              <p className="font-thin text-xs mt-3 text-blue-400" >Selengkapnya...</p>
            </div>
        </button>
    );

}