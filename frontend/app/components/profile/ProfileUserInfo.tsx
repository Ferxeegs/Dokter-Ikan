'use client';

import Image from 'next/image';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  address: string;
  role: string;
  phone_number?: string;
  created_at?: string;
  image?: string;
}

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-900 font-semibold">Nama Lengkap</label>
          <input type="text" value={user.name} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
        <div>
          <label className="block text-gray-900 font-semibold">Alamat Email</label>
          <input type="email" value={user.email} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
          <p className="text-green-600 text-sm">Alamat Email Sudah Diverifikasi.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-900 font-semibold">Nomor HP</label>
          <input type="text" value={user.phone_number || '-'} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
        <div>
          <label className="block text-gray-900 font-semibold">Bergabung Sejak</label>
          <input type="text" value={user.created_at || '-'} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
        </div>
      </div>
      <div>
        <label className="block text-gray-900 font-semibold">Alamat</label>
        <input type="text" value={user.address || '-'} className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md" disabled />
      </div>

      <div className="mt-6 text-right">
        <Link href="/edit-profile">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition">
            Ubah Data
          </button>
        </Link>
      </div>
    </div>
  );
}
