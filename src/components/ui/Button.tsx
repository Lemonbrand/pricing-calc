import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-[family-name:var(--font-display)] font-bold uppercase tracking-wide
    border-2 border-[var(--color-ink)]
    transition-all duration-100 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
  `;

  const variantStyles = {
    primary: `
      bg-[var(--color-brand-red)] text-white
      shadow-[var(--shadow-brutal)]
      hover:bg-[var(--color-brand-red-dark)]
    `,
    secondary: `
      bg-white text-[var(--color-ink)]
      shadow-[var(--shadow-brutal)]
      hover:bg-[var(--color-cream)]
    `,
    danger: `
      bg-[var(--color-ink)] text-white
      shadow-[var(--shadow-brutal-red)]
      hover:bg-[var(--color-ink-light)]
    `,
    ghost: `
      bg-transparent text-[var(--color-ink)] border-transparent
      shadow-none
      hover:bg-[var(--color-ink)]/5 hover:border-[var(--color-ink)]
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
