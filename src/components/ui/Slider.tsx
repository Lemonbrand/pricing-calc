interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  showValue?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  showValue = true,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] font-[family-name:var(--font-display)]">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-bold text-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 px-3 py-1 border-2 border-[var(--color-brand-red)] font-[family-name:var(--font-mono)]">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 appearance-none cursor-pointer border-2 border-[var(--color-ink)]"
          style={{
            background: `linear-gradient(to right, var(--color-brand-red) 0%, var(--color-brand-red) ${percentage}%, white ${percentage}%, white 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-[var(--color-ink-light)] mt-2 font-[family-name:var(--font-mono)]">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
