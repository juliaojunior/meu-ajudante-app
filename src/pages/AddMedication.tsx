import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useMedications } from '@/store/useMedications';
import { extractMedicationData } from '@/services/imageAnalysis';

export function AddMedication() {
  const navigate = useNavigate();
  const { addMedication } = useMedications();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    genericName: '',
    dosage: '',
    format: '',
    time: '08:00',
    frequency: 'Diário',
    hasAlarm: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const result = await extractMedicationData(base64String, file.type);
        
        if (result.sucesso && result.medicamento) {
          setForm(prev => ({
            ...prev,
            name: result.medicamento!.nome_principal || prev.name,
            genericName: result.medicamento!.nome_generico || prev.genericName,
            dosage: result.medicamento!.concentracao_ou_dosagem || prev.dosage,
            format: result.medicamento!.formato_sugerido || prev.format,
          }));
        } else {
          setErrorMsg(result.mensagem_erro || "Não conseguimos extrair as informações. Por favor, preencha manualmente.");
        }
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao processar imagem.");
      setIsAnalyzing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.time) {
      setErrorMsg("Nome e horário são obrigatórios.");
      return;
    }
    
    addMedication(form);
    navigate(-1);
  };

  return (
    <main className="min-h-screen pb-32 max-w-[1024px] mx-auto">
      {/* Header */}
      <header className="bg-primary-dark text-white px-4 pt-6 pb-4 rounded-b-[20px] shadow-sm mb-4 flex items-center gap-3 sticky top-0 z-10 transition-colors">
        <Button variant="ghost" className="w-[48px] h-[48px] p-0 shrink-0 text-white hover:bg-white/10" onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={36} />
        </Button>
        <div>
          <h1 className="text-[22px] font-bold mb-1">Novo Remédio</h1>
          <p className="text-[16px] font-normal leading-normal opacity-90">Preencha os dados abaixo</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-2 flex flex-col">
        
        {/* Helper Card for AI */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button 
          type="button"
          variant="photo"
          className="mb-[20px] flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <><Loader2 className="animate-spin" /> Lendo Embalagem...</>
          ) : "📷 TIRAR FOTO DA CAIXA"}
        </Button>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-[12px] flex items-start gap-4 text-red-800 mb-5">
            <AlertCircle className="shrink-0 mt-0.5" />
            <p className="font-medium text-base leading-snug">{errorMsg}</p>
          </div>
        )}

        <Input 
          label="Nome do Remédio" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Dosagem / Concentração" 
          name="dosage" 
          value={form.dosage} 
          onChange={handleChange} 
        />

        <Input 
          label="Nome Genérico" 
          name="genericName" 
          value={form.genericName} 
          onChange={handleChange} 
        />

        <Input 
          label="Horário" 
          type="time" 
          name="time" 
          value={form.time} 
          onChange={handleChange} 
        />

        <div className="flex flex-col gap-2 w-full mb-5">
          <label className="text-[18px] font-semibold text-text-main">Frequência</label>
          <select 
            name="frequency" 
            value={form.frequency} 
            onChange={handleChange}
            className="flex h-[56px] w-full rounded-[12px] border-2 border-border-input bg-white px-4 text-[18px] text-text-main focus-visible:outline-none focus:border-primary"
          >
            <option>Diário</option>
            <option>Dias Alternados</option>
            <option>Uso Contínuo</option>
          </select>
        </div>

        <Switch 
          label="Alarme Sonoro" 
          checked={form.hasAlarm} 
          onChange={(checked) => setForm(prev => ({ ...prev, hasAlarm: checked }))} 
        />

        {/* Action Buttons */}
        <div className="mt-[30px] flex gap-[10px]">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-[2]">
            Salvar
          </Button>
        </div>
      </form>
    </main>
  );
}
