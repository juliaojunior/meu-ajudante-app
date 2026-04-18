"use client";

import { ArrowLeft, Trash2, Edit3, Pill, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMedicationStore, Medication } from "@/store/useMedicationStore";

export default function MedicationDetails() {
  const router = useRouter();
  const params = useParams();
  const { medications, removeMedication } = useMedicationStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [med, setMed] = useState<Medication | null>(null);

  useEffect(() => {
    // Pegando o identificador maluco da URL
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
    
    const found = medications.find(m => m.id === id);
    if (found) {
      setMed(found);
    } else if (medications.length > 0) {
      // Se não achou e tem coisa na lista, volta
      router.replace('/');
    }
  }, [params, medications, router]);

  if (!med) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-500">Abrindo embalagem...</p>
      </div>
    );
  }

  const handleDelete = () => {
    removeMedication(med.id);
    setIsModalOpen(false);
    // Retorna direto pra home pra ver a lista atualizada
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
        <h1 className="text-2xl font-extrabold text-gray-900">Sobre o Remédio</h1>
      </header>

      <main className="flex-1 p-5 space-y-6">
        {/* Representação Visual Gigante */}
        <div className="w-full bg-blue-100/50 aspect-video rounded-[32px] flex flex-col items-center justify-center border-4 border-blue-200 shadow-sm relative overflow-hidden">
           {med.fotoBase64 ? (
              <img src={med.fotoBase64} alt={`Caixa de ${med.nome}`} className="w-full h-full object-cover" />
           ) : (
              <>
                 <Pill size={100} className="text-blue-500 opacity-20 absolute" />
                 <Pill size={80} className="text-brand-600 relative z-10" />
                 <p className="mt-4 font-bold text-blue-800 text-xl relative z-10">Ficha Médica</p>
              </>
           )}
        </div>

        {/* Informações Básicas com leitura clara */}
        <div className="bg-white p-6 rounded-[32px] border-4 border-gray-200 shadow-sm space-y-6">
          <div>
            <p className="text-xl font-extrabold text-blue-600 uppercase tracking-wide">Qual é o Nome?</p>
            <h2 className="text-4xl font-black text-gray-900 leading-none mt-1">{med.nome}</h2>
            {med.generico && (
              <p className="text-xl text-gray-500 font-semibold mt-2">({med.generico})</p>
            )}
          </div>
          
          <div className="pt-6 border-t-4 border-gray-100">
             <p className="text-xl font-extrabold text-blue-600 uppercase tracking-wide">Quando Tomar?</p>
             <h3 className="text-3xl font-black text-gray-900 mt-1">{med.periodicidade}, às {med.horario}</h3>
          </div>
          
          <div className="pt-6 border-t-4 border-gray-100 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">Telefone / Alarme</span>
            {med.alarmeVisivel ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-green-600">Marcado</span>
                <div className="w-6 h-6 bg-green-500 rounded-full shadow-inner animate-pulse ring-4 ring-green-100"></div>
              </div>
            ) : (
                <span className="text-xl font-bold text-gray-400">Desligado</span>
            )}
          </div>
        </div>

        {/* Ações Radicais */}
        <div className="flex flex-col space-y-4 pt-4">
          <Link href={`/medication/${med.id}/edit`} className="min-h-[80px] w-full flex items-center justify-center space-x-4 text-2xl font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 border-4 border-blue-200 rounded-3xl transition-colors active:scale-95">
            <Edit3 size={32} />
            <span>Alterar Cadastro</span>
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="min-h-[80px] w-full flex items-center justify-center space-x-4 text-2xl font-bold text-red-700 bg-red-50 hover:bg-red-100 border-4 border-red-200 rounded-3xl transition-colors active:scale-95"
          >
            <Trash2 size={32} />
            <span>Excluir Remédio</span>
          </button>
        </div>
      </main>

      {/* Modal de Confirmação à Prova de Erros (A11y Extreme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-5 transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl flex flex-col items-center text-center outline outline-8 outline-red-500">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={64} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight">Remover este Remédio?</h2>
            <p className="text-xl text-gray-600 mb-10 font-bold leading-relaxed">
              O <strong className="text-red-600">{med.nome}</strong> será sumariamente apagado da sua rotina e não tocará mais.
            </p>
            
            <div className="flex flex-col w-full space-y-4">
              <button 
                onClick={handleDelete}
                className="min-h-[88px] w-full text-2xl font-black text-white bg-red-600 hover:bg-red-700 rounded-3xl shadow-xl shadow-red-600/30 active:scale-95 border-b-4 border-red-800"
              >
                APAGAR AGORA
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="min-h-[88px] w-full text-2xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-3xl active:scale-95"
              >
                Cancelar Reparação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
