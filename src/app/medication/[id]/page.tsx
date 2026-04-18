"use client";

import { ArrowLeft, Trash2, Edit3, Image as ImageIcon, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MedicationDetails() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    // Integração futura com o Zustand store / backend
    setIsModalOpen(false);
    alert("Remédio excluído com sucesso!");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      <header className="bg-white px-5 py-6 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
        <Link 
          href="/" 
          aria-label="Voltar para Início"
          className="min-h-[56px] min-w-[56px] flex items-center justify-center bg-gray-100 rounded-full text-gray-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Remédio</h1>
      </header>

      <main className="flex-1 p-5 space-y-6">
        {/* Foto do Medicamento Em Destaque */}
        <div className="w-full bg-gray-200 aspect-video rounded-3xl overflow-hidden flex items-center justify-center border-2 border-gray-300 shadow-md">
          {/* Pode ser substituído futuramente por um <img> tag quando salvar fotos localmente */}
          <ImageIcon size={64} className="text-gray-400" />
        </div>

        {/* Informações Básicas */}
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
          <div>
            <p className="text-lg font-bold text-gray-500 uppercase">Nome Comercial</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Losartana 50mg</h2>
          </div>
          <div>
             <p className="text-lg font-bold text-gray-500 uppercase">Período Selecionado</p>
             <h3 className="text-2xl font-bold text-blue-800">Todo Dia, às 08:00</h3>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-700">Alarme ativado</span>
            <div className="w-5 h-5 bg-green-500 rounded-full shadow-inner animate-pulse ring-4 ring-green-100"></div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col space-y-4 pt-4">
          <button className="min-h-[72px] w-full flex items-center justify-center space-x-3 text-xl font-bold text-blue-800 bg-blue-100/50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl transition-colors active:scale-95">
            <Edit3 size={28} />
            <span>Editar Informações</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="min-h-[72px] w-full flex items-center justify-center space-x-3 text-xl font-bold text-red-700 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl transition-colors active:scale-95"
          >
            <Trash2 size={28} />
            <span>Excluir Remédio</span>
          </button>
        </div>
      </main>

      {/* Modal de Confirmação (A11y Extreme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Tem certeza?</h2>
            <p className="text-xl text-gray-600 mb-8 font-medium">Ao excluir, os alarmes para a "Losartana" serão cancelados e o histórico apagado.</p>
            
            <div className="flex flex-col w-full space-y-3">
              <button 
                onClick={handleDelete}
                className="min-h-[72px] w-full text-xl font-bold text-white bg-red-600 rounded-2xl shadow-lg active:scale-95"
              >
                Sim, quero excluir
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="min-h-[72px] w-full text-xl font-bold text-gray-700 bg-gray-100 rounded-2xl active:scale-95"
              >
                Não, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
