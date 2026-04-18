import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Clock, CalendarDays, Bell, Pill } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/Molecule/ConfirmModal';
import { useMedications } from '@/store/useMedications';

export function MedicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { medications, deleteMedication } = useMedications();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const medication = medications.find(m => m.id === id);

  if (!medication) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-[1024px] mx-auto">
        <p className="text-2xl font-bold text-gray-800 text-center">Medicamento não encontrado.</p>
        <Button onClick={() => navigate(-1)} size="lg">Voltar</Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMedication(medication.id);
    navigate('/', { replace: true });
  };

  return (
    <main className="min-h-screen pb-32 max-w-[1024px] mx-auto">
       {/* Header */}
       <header className="bg-primary-dark text-white px-4 pt-6 pb-4 rounded-b-[20px] shadow-sm mb-4 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" className="w-[48px] h-[48px] p-0 shrink-0 text-white hover:bg-white/10" onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={36} />
        </Button>
        <div>
          <h1 className="text-[22px] font-bold mb-1">Detalhes</h1>
          <p className="text-[16px] font-normal leading-normal opacity-90">Informações do medicamento</p>
        </div>
      </header>

      <div className="px-4 py-2 flex flex-col gap-4">
        
        {/* Placeholder Photo Area */}
        <div className="w-full h-[160px] bg-border-light rounded-[16px] flex flex-col items-center justify-center mb-0 relative overflow-hidden">
           <span className="text-[40px] z-10">📦</span>
        </div>

        {/* Info Card */}
        <div className="bg-card rounded-[16px] border-2 border-border-light p-4 flex flex-col">
           <h3 className="text-[20px] font-bold text-text-main">
             {medication.name} {medication.dosage ? medication.dosage : ''}
           </h3>
           <p className="text-[18px] text-text-muted mt-2 font-semibold">
              Genérico: {medication.genericName || "Não informado"}
           </p>
           <p className="text-[18px] text-text-main mt-2 font-semibold">
              ⏰ {medication.frequency} às {medication.time}
           </p>
           <p className="text-[18px] text-text-main mt-2 font-semibold">
              🔔 Alarme: {medication.hasAlarm ? 'Ativado' : 'Desativado'}
           </p>
        </div>

        {/* Delete Area */}
        <Button 
            variant="outline-danger" 
            size="lg" 
            className="w-full mt-3 flex items-center justify-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
           Apagar Remédio
        </Button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Tem certeza?"
        description="Você quer mesmo parar o controle deste remédio?"
        confirmText="Sim, Apagar"
        cancelText="Não, Voltar"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
}
