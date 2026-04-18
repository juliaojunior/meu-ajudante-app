import React, { useEffect } from 'react';
import { Button } from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Sim, Excluir",
  cancelText = "Não, Voltar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-card rounded-[24px] p-6 w-full max-w-sm text-center flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-[22px] font-bold text-text-main">{title}</h3>
        <p className="mt-3 mb-6 text-[18px] text-text-muted">
          {description}
        </p>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="destructive" 
            size="lg" 
            onClick={onConfirm}
            className="w-full"
          >
            {confirmText}
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={onCancel}
            className="w-full mt-2"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
