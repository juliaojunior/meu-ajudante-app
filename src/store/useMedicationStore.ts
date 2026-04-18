import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Medication {
  id: string;
  nome: string;
  generico: string;
  horario: string;
  periodicidade: string;
  alarmeVisivel: boolean;
  taken: boolean; // Simula a marcação diária no card da Home
}

interface MedicationState {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'taken'>) => void;
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
          { ...med, id: crypto.randomUUID(), taken: false }
        ]
      })),
      
      // Remove pela ID
      removeMedication: (id) => set((state) => ({
        medications: state.medications.filter((m) => m.id !== id)
      })),
      
      // Inverte o status de tomada do remédio
      toggleTaken: (id) => set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? { ...m, taken: !m.taken } : m
        )
      })),
      
      // Para possível tela de edição futura
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
