
export default function CardPayment() {
    return (
        <div className="flex flex-col w-auto bg-white border-blue-300  border-4 text-black px-20 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition my-10">
            <div className="flex flex-row border-4 flex-1">
                <img src="/peserta.png" alt="Konsultasi Icon" className="w-1/5 mb-4  bg-blue-400 ml-48" />
                <div className="flex flex-col text-black text-xs justify-center text-left min-w-32 pr-10">
                    <p className="ml-7 font-bold text-lg">drh. Diva Putri</p>
                    <p className="ml-7 font-lato text-sm italic">Dokter Hewan</p>
                </div>

            </div>
            
            <div className="border-4 grid grid-cols-2 font-bold">
                <div></div>
                <p className="">Biaya  per menit</p>
                <p className="ml-2">Rp 40.000</p>
            </div>

            <div className="flex flex-row border-4 ml-48 font-bold">
                <p className="mr-96">Biaya  pelayanan</p>
                <p className="ml-2">Rp 10.000</p>
            </div>

            <div className="flex flex-row border-4 ml-48 font-bold">
                <p className="mr-96">Total Pembayaran</p>
                <p className="ml-2 border-4">Rp 10.000</p>
            </div>
        </div>
    );

}