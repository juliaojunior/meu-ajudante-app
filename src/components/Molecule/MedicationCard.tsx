import React from 'react';
import { CheckCircle, Circle, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Medication } from '@/store/useMedications';

interface MedicationCardProps {
  key?: React.Key;
  medication: Medication;
  onToggleTaken: (id: string) => void;
  onClick: (id: string) => void;
}

export function MedicationCard({ medication, onToggleTaken, onClick }: MedicationCardProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-3 p-4 rounded-[16px] border-2 bg-card mb-4 transition-all cursor-pointer shadow-sm active:scale-[0.98]",
        medication.takenToday 
          ? "border-border-light opacity-70" 
          : "border-border-light"
      )}
      onClick={() => onClick(medication.id)}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-[56px] h-[56px] rounded-[12px] flex items-center justify-center shrink-0 text-[28px]",
          medication.takenToday ? "bg-[#E3FCEF] text-success" : "bg-icon-bg text-primary"
        )}>
          {medication.takenToday ? "💉" : "💊"}
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-[20px] font-bold text-text-main leading-tight mb-0.5">
            {medication.name}
          </h3>
          <p className="text-[18px] font-semibold text-primary leading-tight">
            {medication.time} {medication.dosage ? `- ${medication.dosage}` : ''}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleTaken(medication.id);
        }}
        className={cn(
          "h-[60px] flex items-center justify-center rounded-[12px] text-[20px] font-bold transition-all w-full mt-1 gap-2",
          medication.takenToday 
            ? "bg-border-light text-text-muted cursor-default" 
            : "bg-success text-white hover:bg-success-dark hover:shadow-md"
        )}
      >
        {medication.takenToday ? "✓ Já Tomado" : "Marcar como Tomado"}
      </button>
    </div>
  );
}
