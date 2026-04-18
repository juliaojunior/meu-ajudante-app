import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MedicationCard } from '@/components/Molecule/MedicationCard';
import { useMedications } from '@/store/useMedications';

export function Home() {
  const navigate = useNavigate();
  const { medications, toggleTaken } = useMedications();

  // Sort by time
  const sortedMedications = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <main className="min-h-screen pb-32 max-w-[1024px] mx-auto">
      {/* Header */}
      <header className="bg-primary text-white px-4 pt-6 pb-4 rounded-b-[20px] shadow-sm mb-4">
        <h1 className="text-[22px] font-bold mb-1">
          Olá, Sr. João
        </h1>
        <p className="text-[16px] font-normal leading-normal opacity-90">
          Bom dia! Hora de cuidar da saúde.
        </p>
      </header>

      {/* Medication List */}
      <div className="px-4 flex flex-col">
        <span className="text-[14px] uppercase font-bold text-text-muted mb-3 block tracking-wide">Próximos Remédios</span>
        
        {sortedMedications.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center gap-4 bg-card rounded-[16px] border border-border-light border-dashed">
            <p className="text-xl font-bold text-text-main">Nenhum remédio cadastrado</p>
            <p className="text-base text-text-muted font-medium">Toque no + para adicionar.</p>
          </div>
        ) : (
          sortedMedications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onToggleTaken={toggleTaken}
              onClick={(id) => navigate(`/medication/${id}`)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <Button
        variant="fab"
        onClick={() => navigate('/add')}
        aria-label="Adicionar Novo Remédio"
      >
        +
      </Button>
    </main>
  );
}
