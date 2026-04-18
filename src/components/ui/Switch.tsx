import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer bg-white rounded-[12px] p-4 active:bg-gray-50 transition-colors mt-[10px]">
      <span className="text-[18px] font-semibold text-text-main select-none">
        {label}
      </span>
      <div
        className={cn(
          "relative inline-flex h-[32px] w-[60px] shrink-0 cursor-pointer items-center rounded-[16px] transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-success" : "bg-gray-300"
        )}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={cn(
            "pointer-events-none block h-[24px] w-[24px] rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-[32px]" : "translate-x-[4px]"
          )}
        />
      </div>
    </label>
  );
}
