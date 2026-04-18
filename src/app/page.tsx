"use client";

import { Plus, Pill, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMedicationStore } from "@/store/useMedicationStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { medications, toggleTaken } = useMedicationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-500 animate-pulse">Carregando...</p>
      </div>
    );
  }

  // Ordena os remédios pelo horário mais cedo
  const sortedMeds = [...medications].sort((a, b) => a.horario.localeCompare(b.horario));
  
  // Resgata o relógio de hoje com fuso zero para checagem do reset de botão
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col h-full px-5 pt-10">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 leading-tight">
          Bom dia,<br />hora de cuidar<br />da saúde!
        </h1>
        <p className="text-xl text-gray-700 mt-3 font-medium">Seus remédios para hoje:</p>
      </header>

      <div className="flex flex-col space-y-5 pb-24">
        {sortedMeds.length === 0 ? (
          <div className="p-8 mt-4 text-center bg-gray-100 rounded-3xl border-4 border-dashed border-gray-300">
            <p className="text-2xl text-gray-600 font-bold leading-relaxed">
              Você ainda não tem remédios na lista.
            </p>
            <p className="text-lg text-gray-500 mt-2">Clique no botão grande <strong className="text-brand-600">( + )</strong> abaixo para começar.</p>
          </div>
        ) : (
          sortedMeds.map((med) => {
            const isTaken = med.lastTakenDate === today; // <--- A MÁGICA DO MOTOR AQUI!

            return (
              <Link href={`/medication/${med.id}`} key={med.id} className="block group">
                <div
                  className={`p-6 rounded-3xl border-4 flex items-center justify-between transition-colors ${
                    isTaken
                      ? "bg-green-50 border-green-200 opacity-90"
                      : "bg-white border-blue-100 group-hover:border-blue-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-5">
                    {med.fotoBase64 ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-200 shadow-inner">
                        <img src={med.fotoBase64} alt={`Caixa de ${med.nome}`} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-2xl ${
                          isTaken ? "bg-green-100 text-green-600" : "bg-blue-100 text-brand-600"
                        }`}
                      >
                        <Pill size={40} />
                      </div>
                    )}
                    <div>
                      <p className={`text-2xl font-bold ${isTaken ? "text-green-800 line-through opacity-70" : "text-gray-900"}`}>
                        {med.nome}
                      </p>
                      <p className="text-xl text-gray-700 font-semibold mt-1">Às {med.horario}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTaken(med.id);
                    }}
                    aria-label={isTaken ? "Desmarcar como tomado" : "Marcar como tomado"}
                    className={`min-h-[76px] min-w-[76px] rounded-2xl flex items-center justify-center transition-transform active:scale-90 z-10 relative ${
                      isTaken
                        ? "bg-green-500 text-white shadow-lg border-2 border-green-600"
                        : "bg-gray-100 text-gray-400 border-4 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <CheckCircle2 size={46} strokeWidth={isTaken ? 3 : 2.5} />
                  </button>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
        <Link
          href="/add"
          className="pointer-events-auto h-[88px] w-[88px] bg-brand-600 hover:bg-brand-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 active:scale-95 transition-transform border-4 border-white"
          aria-label="Adicionar Novo Remédio"
        >
          <Plus size={52} strokeWidth={3.5} />
        </Link>
      </div>
    </div>
  );
}
