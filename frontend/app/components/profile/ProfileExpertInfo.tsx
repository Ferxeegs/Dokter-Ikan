'use client';

import Link from 'next/link';

interface FishExpert {
  name: string;
  email: string;
  phone_number: string;
  specialization: string;
  experience: string;
  created_at?: string;
  image?: string;
}

interface ProfileExpertInfoProps {
  fishExpert: FishExpert;
}

export default function ProfileExpertInfo({ fishExpert }: ProfileExpertInfoProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-900 font-semibold">Nama Lengkap</label>
          <input type="text" value={fishExpert.name} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
        <div>
          <label className="block text-gray-900 font-semibold">Alamat Email</label>
          <input type="email" value={fishExpert.email} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-900 font-semibold">Nomor HP</label>
          <input type="text" value={fishExpert.phone_number || '-'} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
        <div>
          <label className="block text-gray-900 font-semibold">Bergabung Sejak</label>
          <input type="text" value={fishExpert.created_at || '-'} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-900 font-semibold">Spesialisasi</label>
          <input type="text" value={fishExpert.specialization} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
        <div>
          <label className="block text-gray-900 font-semibold">Pengalaman</label>
          <input type="text" value={fishExpert.experience} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
      </div>

      <div className="mt-6 text-right">
        <Link href="/edit-profile-expert">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition">
            Ubah Data
          </button>
        </Link>
      </div>
    </div>
  );
}