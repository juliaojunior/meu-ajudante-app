"use client";

import { Plus, Pill, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock temporário simulando Zustand (será conectado posteriormente)
const initialMedications = [
  { id: 1, name: "Losartana", time: "08:00", taken: false },
  { id: 2, name: "Vitamina D", time: "12:00", taken: false },
  { id: 3, name: "Sinvastatina", time: "20:00", taken: false },
];

export default function Home() {
  const [meds, setMeds] = useState(initialMedications);

  const toggleStatus = (id: number) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  return (
    <div className="flex flex-col h-full px-5 pt-10">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 leading-tight">
          Bom dia,<br />hora de cuidar<br />da saúde!
        </h1>
        <p className="text-xl text-gray-700 mt-3 font-medium">Seus remédios de hoje:</p>
      </header>

      <div className="flex flex-col space-y-5">
        {meds.map((med) => (
          <div
            key={med.id}
            className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-colors ${
              med.taken
                ? "bg-green-50 border-green-200 opacity-90"
                : "bg-white border-blue-100 shadow-sm"
            }`}
          >
            <div className="flex items-center space-x-5">
              <div
                className={`p-4 rounded-2xl ${
                  med.taken ? "bg-green-100 text-green-600" : "bg-blue-100 text-brand-600"
                }`}
              >
                <Pill size={40} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${med.taken ? "text-green-800 line-through opacity-70" : "text-gray-900"}`}>
                  {med.name}
                </p>
                <p className="text-xl text-gray-700 font-semibold mt-1">Às {med.time}</p>
              </div>
            </div>

            <button
              onClick={() => toggleStatus(med.id)}
              aria-label={med.taken ? "Desmarcar como tomado" : "Marcar como tomado"}
              className={`min-h-[72px] min-w-[72px] rounded-2xl flex items-center justify-center transition-transform active:scale-95 ${
                med.taken
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <CheckCircle2 size={44} />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
        <Link
          href="/add"
          className="pointer-events-auto h-20 w-20 bg-brand-600 hover:bg-brand-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/40 active:scale-95 transition-transform border-4 border-white"
          aria-label="Adicionar Novo Remédio"
        >
          <Plus size={44} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
