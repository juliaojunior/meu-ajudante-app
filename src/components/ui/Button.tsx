import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline-danger' | 'ghost' | 'fab' | 'photo';
  size?: 'default' | 'lg' | 'fab';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
          {
            'bg-success text-white hover:bg-success-dark': variant === 'primary',
            'bg-[#F4F5F7] text-text-main border-2 border-border-light hover:bg-gray-200': variant === 'secondary',
            'bg-danger text-white hover:opacity-90': variant === 'destructive',
            'border-2 border-danger text-danger bg-transparent hover:bg-danger/10': variant === 'outline-danger',
            'hover:bg-primary/10 hover:text-primary': variant === 'ghost',
            'bg-primary text-white shadow-md hover:bg-primary-dark': variant === 'fab',
            'bg-warning text-black border-4 border-dashed border-warning-dark hover:opacity-90': variant === 'photo',

            'h-[60px] px-6 text-[20px] rounded-[12px]': (size === 'lg' || size === 'default') && variant !== 'photo' && variant !== 'fab',
            'h-[64px] w-[64px] rounded-[32px] fixed bottom-5 right-5 text-[32px] z-50': variant === 'fab' || size === 'fab',
            'w-full p-6 leading-none rounded-[16px] text-[18px] h-auto': variant === 'photo',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
