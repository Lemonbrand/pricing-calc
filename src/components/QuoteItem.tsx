import { Select, Button, Slider } from './ui';
import type { QuoteItem as QuoteItemType, Config, DeliverableType, ComplexityTier } from '../types';
import { DELIVERABLE_LABELS, COMPLEXITY_LABELS } from '../types';
import { formatCurrency } from '../utils/pricing';

interface QuoteItemProps {
  item: QuoteItemType;
  config: Config;
  onUpdate: (updates: Partial<Pick<QuoteItemType, 'type' | 'complexity' | 'extraRevisions'>>) => void;
  onRemove: () => void;
}

export function QuoteItem({ item, config, onUpdate, onRemove }: QuoteItemProps) {
  const deliverableOptions = Object.entries(DELIVERABLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const complexityOptions = Object.entries(COMPLEXITY_LABELS).map(([value, label]) => ({
    value,
    label: `${label} (${config.complexityMultipliers[value as ComplexityTier]}x)`,
  }));

  return (
    <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Deliverable"
            options={deliverableOptions}
            value={item.type}
            onChange={(e) => onUpdate({ type: e.target.value as DeliverableType })}
          />
          <Select
            label="Complexity"
            options={complexityOptions}
            value={item.complexity}
            onChange={(e) => onUpdate({ complexity: e.target.value as ComplexityTier })}
          />
          <Slider
            label="Extra Revisions"
            value={item.extraRevisions}
            min={0}
            max={10}
            step={1}
            onChange={(value) => onUpdate({ extraRevisions: value })}
            formatValue={(v) => v === 0 ? 'None' : `+${v}`}
          />
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--color-ink)]">
        <div className="text-sm text-[var(--color-ink-light)] font-[family-name:var(--font-mono)]">
          Base: {formatCurrency(item.basePrice)} × {config.complexityMultipliers[item.complexity]}
          {item.extraRevisions > 0 && (
            <span> + {item.extraRevisions} rev @ {formatCurrency(config.extraRevisionRate)}</span>
          )}
        </div>
        <div className="text-xl font-extrabold text-[var(--color-ink)] font-[family-name:var(--font-display)]">
          {formatCurrency(item.calculatedPrice)}
        </div>
      </div>
    </div>
  );
}
