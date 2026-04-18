import { useState, useEffect } from 'react';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage?: string;
  format?: string;
  time: string; // HH:mm
  frequency: string;
  hasAlarm: boolean;
  takenToday: boolean;
  photoUrl?: string;
}

const STORAGE_KEY = '@meu-ajudante:medications';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing medications', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  const addMedication = (medication: Omit<Medication, 'id' | 'takenToday'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Math.random().toString(36).substr(2, 9),
      takenToday: false,
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, ...updates } : med)));
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const toggleTaken = (id: string) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, takenToday: !med.takenToday } : med)));
  };

  return {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleTaken
  };
}
