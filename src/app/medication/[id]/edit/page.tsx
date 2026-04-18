"use client";

import { useState, useEffect } from "react";
import { Camera, Volume2, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMedicationStore } from "@/store/useMedicationStore";

export default function EditMedication() {
  const router = useRouter();
  const params = useParams();
  
  const { medications, updateMedication } = useMedicationStore();
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    generico: "",
    horario: "08:00",
    periodicidade: "Diário",
    alarmeVisivel: true,
    fotoBase64: "",
  });

  const medId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  useEffect(() => {
    if (medId) {
      const found = medications.find(m => m.id === medId);
      if (found) {
        setFormData({
          nome: found.nome,
          generico: found.generico,
          horario: found.horario,
          periodicidade: found.periodicidade,
          alarmeVisivel: found.alarmeVisivel,
          fotoBase64: found.fotoBase64 || "",
        });
        setIsLoaded(true);
      } else if (medications.length > 0) {
        router.replace('/');
      }
    }
  }, [medId, medications, router]);

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 512;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Erro de render.");
          
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          
          setFormData((prev) => ({ ...prev, fotoBase64: compressedBase64 }));
          alert("Foto atualizada minimizada com sucesso!");
        } catch (err: any) {
           console.error("Falha:", err);
           alert("Falha ao refazer foto. Tente manualmente.");
        } finally {
          setLoading(false);
          URL.revokeObjectURL(img.src);
        }
      };
      
      img.onerror = () => {
        alert("Erro ao ler câmera.");
        setLoading(false);
      }
    } catch {
       alert("Erro inesperado.");
       setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      alert("ATENÇÃO: Você precisa preencher o Nome do Remédio!");
      return;
    }
    
    if (medId) {
      updateMedication(medId, formData);
      router.push(`/medication/${medId}`);
    }
  };

  if (!isLoaded) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" size={64}/></div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      <header className="bg-white px-5 py-6 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
        <Link 
          href={`/medication/${medId}`}
          aria-label="Voltar para ficha"
          className="min-h-[56px] min-w-[56px] flex items-center justify-center bg-gray-100 rounded-full text-gray-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Atualizar Cadastro</h1>
      </header>

      <main className="flex-1 p-5 flex flex-col space-y-8 overflow-y-auto pb-32">
        <div className="w-full flex space-x-4">
          {formData.fotoBase64 && (
            <div className="w-24 h-24 rounded-2xl bg-gray-200 border-4 border-gray-300 overflow-hidden shrink-0 shadow-md">
              <img src={formData.fotoBase64} alt="Miniatura" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              id="cameraInputUpdate" 
              className="hidden" 
              onChange={handleCaptureImage}
            />
            <label 
              htmlFor="cameraInputUpdate"
              className={`h-full min-h-[96px] w-full flex items-center justify-center space-x-3 rounded-2xl shadow-md transition-transform active:scale-95 text-xl font-bold cursor-pointer border-4 px-4 ${
                loading 
                  ? "bg-gray-200 text-gray-600 border-gray-300 pointer-events-none" 
                  : formData.fotoBase64 ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100" : "bg-brand-600 text-white border-brand-700 hover:bg-brand-500"
              }`}
            >
              {loading ? <Loader2 size={32} className="animate-spin" /> : formData.fotoBase64 ? <ImageIcon size={32} /> : <Camera size={32} />}
              <span className="text-center">{loading ? "Process..." : formData.fotoBase64 ? "Trocar Foto da Caixa" : "Tirar Nova Foto"}</span>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-3">
            <label className="text-2xl font-bold text-gray-800">Corrigir Nome</label>
            <input 
              type="text" 
              className="min-h-[72px] border-4 border-blue-300 rounded-2xl px-5 text-2xl font-extrabold text-blue-900 bg-blue-50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all"
              placeholder="Ex: Losartana"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-2xl font-bold text-gray-800">Genérico (Opcional)</label>
            <input 
              type="text" 
              className="min-h-[72px] border-4 border-blue-300 rounded-2xl px-5 text-2xl font-bold text-blue-900 bg-blue-50 focus:border-brand-500 outline-none transition-all"
              value={formData.generico}
              onChange={(e) => setFormData({...formData, generico: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-3">
              <label className="text-2xl font-bold text-gray-800">Que Horas?</label>
              <input 
                type="time" 
                className="min-h-[72px] border-4 border-blue-300 rounded-2xl px-5 text-2xl font-extrabold text-brand-600 bg-blue-50 focus:border-brand-500 outline-none w-full"
                value={formData.horario}
                onChange={(e) => setFormData({...formData, horario: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-2xl font-bold text-gray-800">Frequência</label>
              <select 
                className="min-h-[72px] border-4 border-blue-300 rounded-2xl pl-4 pr-1 text-2xl font-bold text-blue-900 bg-blue-50 focus:border-brand-500 outline-none"
                value={formData.periodicidade}
                onChange={(e) => setFormData({...formData, periodicidade: e.target.value})}
              >
                <option>Diário</option>
                <option>Alternado</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-6 bg-white border-4 border-gray-200 rounded-3xl mt-6 cursor-pointer" onClick={() => setFormData({...formData, alarmeVisivel: !formData.alarmeVisivel})}>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-100 text-brand-600 rounded-2xl">
                <Volume2 size={36} />
              </div>
              <span className="text-2xl font-bold text-gray-800">Tocar Alarme</span>
            </div>
            
            <div className={`relative inline-flex items-center min-h-[56px] min-w-[96px] rounded-full transition-colors border-4 ${formData.alarmeVisivel ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}>
              <div className={`w-10 h-10 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.alarmeVisivel ? 'translate-x-11' : 'translate-x-1'}`}></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t-2 border-gray-200 flex space-x-4 max-w-md mx-auto shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-40">
        <Link 
          href={`/medication/${medId}`} 
          className="flex-1 min-h-[80px] flex items-center justify-center text-2xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-2xl active:scale-95 transition-transform"
        >
          Cancelar
        </Link>
        <button 
          onClick={handleSave}
          className="flex-[2] flex items-center justify-center min-h-[80px] text-2xl font-extrabold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-transform shadow-xl shadow-green-600/30 rounded-2xl border-b-4 border-green-800"
        >
          Aplicar
        </button>
      </footer>
    </div>
  );
}
