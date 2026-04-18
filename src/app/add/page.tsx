"use client";

import { useState } from "react";
import { Camera, Volume2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddMedication() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    generico: "",
    horario: "08:00",
    periodicidade: "Diário",
    alarmeVisivel: true,
  });

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
        });
        
        const data = await res.json();
        
        if (data.sucesso && data.medicamento) {
          setFormData((prev) => ({
            ...prev,
            nome: data.medicamento.nome_principal || "",
            generico: data.medicamento.nome_generico || "",
          }));
        } else {
          alert(data.mensagem_erro || "Erro ao ler. Preencha manualmente.");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("Erro ao processar a imagem.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      <header className="bg-white px-5 py-6 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
        <Link 
          href="/" 
          aria-label="Voltar para Início"
          className="min-h-[56px] min-w-[56px] flex items-center justify-center bg-gray-100 rounded-full text-gray-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Remédio</h1>
      </header>

      <main className="flex-1 p-5 flex flex-col space-y-8 overflow-y-auto">
        {/* Extrator IA */}
        <div className="w-full">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            id="cameraInput" 
            className="hidden" 
            onChange={handleCaptureImage}
          />
          <label 
            htmlFor="cameraInput"
            className={`min-h-[80px] w-full flex items-center justify-center space-x-3 rounded-2xl shadow-md transition-transform active:scale-95 text-xl font-bold ${
              loading ? "bg-gray-300 text-gray-600 pointer-events-none" : "bg-brand-600 text-white hover:bg-brand-500"
            }`}
          >
            {loading ? <Loader2 size={32} className="animate-spin" /> : <Camera size={32} />}
            <span>{loading ? "Lendo a embalagem..." : "Tirar Foto da Caixa"}</span>
          </label>
        </div>

        {/* Formulário */}
        <div className="space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="text-xl font-bold text-gray-800">Nome do Remédio</label>
            <input 
              type="text" 
              className="min-h-[64px] border-2 border-gray-300 rounded-xl px-4 text-xl font-semibold focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none"
              placeholder="Ex: Losartana"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xl font-bold text-gray-800">Nome Genérico (Opcional)</label>
            <input 
              type="text" 
              className="min-h-[64px] border-2 border-gray-300 rounded-xl px-4 text-xl bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none"
              value={formData.generico}
              onChange={(e) => setFormData({...formData, generico: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-xl font-bold text-gray-800">Horário</label>
              <input 
                type="time" 
                className="min-h-[64px] border-2 border-gray-300 rounded-xl px-4 text-xl font-bold bg-white focus:border-brand-500 outline-none"
                value={formData.horario}
                onChange={(e) => setFormData({...formData, horario: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xl font-bold text-gray-800">Frequência</label>
              <select 
                className="min-h-[64px] border-2 border-gray-300 rounded-xl px-4 text-xl font-bold bg-white focus:border-brand-500 outline-none"
                value={formData.periodicidade}
                onChange={(e) => setFormData({...formData, periodicidade: e.target.value})}
              >
                <option>Diário</option>
                <option>Alternado</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 bg-white border-2 border-gray-200 rounded-2xl mt-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-brand-600 rounded-xl">
                <Volume2 size={32} />
              </div>
              <span className="text-xl font-bold text-gray-800">Alarme Sonoro</span>
            </div>
            
            {/* Toggle Switch Gigante */}
            <label className="relative inline-flex items-center cursor-pointer min-h-[48px] min-w-[80px]">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.alarmeVisivel}
                onChange={() => setFormData({...formData, alarmeVisivel: !formData.alarmeVisivel})}
              />
              <div className="w-20 h-10 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-9 after:transition-all"></div>
            </label>
          </div>
        </div>
      </main>

      <footer className="p-5 bg-white border-t border-gray-200 flex space-x-4 pb-8">
        <Link 
          href="/" 
          className="flex-1 min-h-[72px] flex items-center justify-center text-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-2xl transition-colors"
        >
          Cancelar
        </Link>
        <button 
          onClick={() => { alert('Salvo com sucesso!'); router.push('/'); }}
          className="flex-[2] flex items-center justify-center min-h-[72px] text-xl font-bold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-transform shadow-lg rounded-2xl"
        >
          Salvar
        </button>
      </footer>
    </div>
  );
}
