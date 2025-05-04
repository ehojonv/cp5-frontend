"use client";

import { useRouter } from "next/navigation";

export default function BeneficiosPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Benefícios e Direitos</h1>
      <p className="text-gray-700 text-lg mb-6">
        Informações sobre o BPC/LOAS, isenção de impostos, passe livre, aposentadoria especial e leis que garantem direitos às pessoas com deficiência, como a Lei Brasileira de Inclusão (LBI).
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
