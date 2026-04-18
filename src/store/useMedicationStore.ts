import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Medication {
  id: string;
  nome: string;
  generico: string;
  horario: string;
  periodicidade: string;
  alarmeVisivel: boolean;
  lastTakenDate: string | null; // Guarda do Dia que foi tomado ao invés de apenas um Booleano fixo
  fotoBase64?: string;
}

interface MedicationState {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'lastTakenDate'>) => void;
  removeMedication: (id: string) => void;
  toggleTaken: (id: string) => void;
  updateMedication: (id: string, updatedMed: Partial<Medication>) => void;
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set) => ({
      medications: [],
      
      // Adiciona auto-gerando um ID seguro
      addMedication: (med) => set((state) => ({
        medications: [
          ...state.medications,
          { ...med, id: crypto.randomUUID(), lastTakenDate: null }
        ]
      })),
      
      removeMedication: (id) => set((state) => ({
        medications: state.medications.filter((m) => m.id !== id)
      })),
      
      toggleTaken: (id) => set((state) => {
        // Tira o "Hoje" (Ex: "2026-04-18")
        const today = new Date().toISOString().split('T')[0]; 
        
        return {
          medications: state.medications.map((m) => {
            if (m.id === id) {
              // Se a data que foi tomado for hoje, o clique do botão remove. Se não, marca!
              const isTakenToday = m.lastTakenDate === today;
              return { ...m, lastTakenDate: isTakenToday ? null : today };
            }
            return m;
          })
        };
      }),
      
      updateMedication: (id, updatedMed) => set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? { ...m, ...updatedMed } : m
        )
      })),
    }),
    {
      name: 'meu-ajudante-storage', // Nome da "gaveta" no navegador
    }
  )
);
