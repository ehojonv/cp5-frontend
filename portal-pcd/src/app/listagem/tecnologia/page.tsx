"use client";

import { useRouter } from "next/navigation";

export default function TecnologiaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Produtos e Tecnologia Assistiva</h1>
      <p className="text-gray-700 text-lg mb-6">
        Descubra recursos tecnológicos como leitores de tela, próteses, órteses, softwares adaptativos e dispositivos de apoio à comunicação e mobilidade.
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
