'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/authHelpers';
import Link from 'next/link';
import { services } from './services';

export default function Listagem() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (

    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Serviços para PCDs</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map(service => (
            <Link
              key={service.title}
              href={`/listagem/${service.href}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
              <p className="text-gray-600 mt-2">Clique para saber mais</p>
            </Link>
          ))}
        </div>
      </div>
    </main>

  );
}