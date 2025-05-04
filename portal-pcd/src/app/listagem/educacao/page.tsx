"use client";

import { useRouter } from "next/navigation";

export default function EducacaoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Educação Inclusiva</h1>
      <p className="text-gray-700 text-lg mb-6">
        Conheça iniciativas para garantir a inclusão escolar em todos os níveis de ensino, desde o atendimento educacional especializado (AEE) até universidades com acessibilidade.
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
