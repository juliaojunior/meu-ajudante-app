import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full mb-5">
        {label && (
          <label className="text-[18px] font-semibold text-text-main">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-[56px] w-full rounded-[12px] border-2 border-border-input bg-white px-4 text-[18px] text-text-main ring-offset-white file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-danger font-medium text-base">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
