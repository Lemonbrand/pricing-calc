import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] mb-2 font-[family-name:var(--font-display)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3
          bg-white border-2 border-[var(--color-ink)]
          font-[family-name:var(--font-mono)] text-sm
          shadow-[var(--shadow-brutal-sm)]
          transition-all duration-100
          focus:outline-none focus:shadow-[var(--shadow-brutal)] focus:translate-x-[-1px] focus:translate-y-[-1px]
          placeholder:text-[var(--color-ink-light)]/50
          ${error ? 'border-[var(--color-brand-red)] shadow-[var(--shadow-brutal-red)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs font-bold text-[var(--color-brand-red)] uppercase tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
}
