"use client";

import { useRouter } from "next/navigation";

export default function SaudePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Serviços de Saúde e Reabilitação</h1>
      <p className="text-gray-700 text-lg mb-6">
        Encontre clínicas de reabilitação, fisioterapia, atendimento multidisciplinar e programas de saúde pública para pessoas com deficiência. O SUS oferece atendimentos específicos em unidades adaptadas e com suporte de profissionais especializados.
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
