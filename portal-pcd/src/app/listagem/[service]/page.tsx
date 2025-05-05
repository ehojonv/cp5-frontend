import { notFound, redirect } from "next/navigation";
import { services } from "../services";

export default function ListagemPage({ params }: { params: { service: string } }) {
    const service = services.find(s => s.href === params.service);
    if (!service) notFound();

    return (
        <main className="min-h-screen p-6 bg-white flex flex-col items-center">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">{service.title}</h1>
            <p className="text-gray-700 text-lg mb-6">{service.text}</p>

            <a
                href="/listagem"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
            >
                Voltar
            </a>
        </main>
    )
}