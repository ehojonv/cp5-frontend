"use client";

import { useRouter } from "next/navigation";

export default function ApoioPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Comunidades e Apoio Psicológico</h1>
      <p className="text-gray-700 text-lg mb-6">
        Redes de apoio emocional, grupos de convivência, apoio psicológico gratuito e espaços de troca de experiências para PCDs e familiares.
      </p>

      <button
        onClick={() => router.back()}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
      >
        Voltar
      </button>
    </main>
  );
}
