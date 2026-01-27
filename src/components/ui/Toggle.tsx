interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-8
          border-2 border-[var(--color-ink)]
          shadow-[var(--shadow-brutal-sm)]
          transition-all duration-100
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2
          ${checked ? 'bg-[var(--color-brand-red)]' : 'bg-white'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'group-hover:shadow-[var(--shadow-brutal)]'}
        `}
      >
        <span
          className={`
            absolute top-1 left-1
            w-5 h-5
            bg-[var(--color-ink)]
            transition-transform duration-100
            ${checked ? 'translate-x-6 bg-white' : ''}
          `}
        />
      </button>
      <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] font-[family-name:var(--font-display)]">
        {label}
      </span>
    </label>
  );
}
