import { useState } from 'react';
import { Button, Card, CardHeader, CardContent, CardFooter } from './ui';
import type { QuoteItem, QuoteModifiers, Config } from '../types';
import { DELIVERABLE_LABELS, COMPLEXITY_LABELS } from '../types';
import { formatCurrency } from '../utils/pricing';

interface QuoteSummaryProps {
  items: QuoteItem[];
  modifiers: QuoteModifiers;
  subtotal: number;
  beforeTax: number;
  taxAmount: number;
  total: number;
  config: Config;
  onSave?: () => void;
  canSave?: boolean;
}

export function QuoteSummary({
  items,
  modifiers,
  subtotal,
  beforeTax,
  taxAmount,
  total,
  config,
  onSave,
  canSave = true,
}: QuoteSummaryProps) {
  const [copied, setCopied] = useState(false);

  const generateQuoteText = () => {
    const lines: string[] = [];
    lines.push('QUOTE SUMMARY');
    lines.push('='.repeat(40));
    lines.push('');

    if (config.business.name) {
      lines.push(`From: ${config.business.name}`);
      if (config.business.email) lines.push(`Email: ${config.business.email}`);
      if (config.business.phone) lines.push(`Phone: ${config.business.phone}`);
      lines.push('');
    }

    lines.push('ITEMS:');
    lines.push('-'.repeat(40));

    items.forEach((item, index) => {
      lines.push(`${index + 1}. ${DELIVERABLE_LABELS[item.type]} (${COMPLEXITY_LABELS[item.complexity]})`);
      lines.push(`   Base: ${formatCurrency(item.basePrice)} × ${config.complexityMultipliers[item.complexity]}`);
      if (item.extraRevisions > 0) {
        lines.push(`   + ${item.extraRevisions} extra revision(s) @ ${formatCurrency(config.extraRevisionRate)}`);
      }
      lines.push(`   Subtotal: ${formatCurrency(item.calculatedPrice)}`);
      lines.push('');
    });

    lines.push('-'.repeat(40));
    lines.push(`Subtotal: ${formatCurrency(subtotal)}`);

    if (modifiers.bundleDiscountApplied) {
      lines.push(`Bundle Discount (${config.bundleDiscountPercent}%): -${formatCurrency(subtotal * config.bundleDiscountPercent / 100)}`);
    }

    if (modifiers.customDiscountPercent > 0) {
      const afterBundle = modifiers.bundleDiscountApplied
        ? subtotal * (1 - config.bundleDiscountPercent / 100)
        : subtotal;
      lines.push(`Custom Discount (${modifiers.customDiscountPercent}%): -${formatCurrency(afterBundle * modifiers.customDiscountPercent / 100)}`);
    }

    if (modifiers.rushFee) {
      lines.push(`Rush Fee (${config.rushFeePercent}%): included`);
    }

    if (modifiers.includeTax && taxAmount > 0) {
      lines.push(`Before Tax: ${formatCurrency(beforeTax)}`);
      lines.push(`Tax (${config.taxPercent}%): +${formatCurrency(taxAmount)}`);
    }

    lines.push('='.repeat(40));
    lines.push(`TOTAL: ${formatCurrency(total)}`);
    lines.push('');
    lines.push(`Includes ${config.revisionsIncluded} revision(s) per item`);

    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateQuoteText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10 text-[var(--color-ink-light)] font-[family-name:var(--font-mono)]">
          Add items to see the quote summary
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[var(--shadow-brutal-lg)]">
      <CardHeader>
        <h3 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
          Quote Summary
        </h3>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex justify-between text-sm font-[family-name:var(--font-mono)]">
              <span className="text-[var(--color-ink-light)]">
                {index + 1}. {DELIVERABLE_LABELS[item.type]} ({COMPLEXITY_LABELS[item.complexity]})
                {item.extraRevisions > 0 && ` +${item.extraRevisions} rev`}
              </span>
              <span className="font-bold text-[var(--color-ink)]">{formatCurrency(item.calculatedPrice)}</span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-[var(--color-ink)] pt-4 space-y-2">
          <div className="flex justify-between text-sm font-[family-name:var(--font-mono)]">
            <span className="text-[var(--color-ink-light)]">Subtotal</span>
            <span className="text-[var(--color-ink)]">{formatCurrency(subtotal)}</span>
          </div>

          {modifiers.bundleDiscountApplied && (
            <div className="flex justify-between text-sm font-bold font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
              <span>Bundle Discount ({config.bundleDiscountPercent}%)</span>
              <span>-{formatCurrency(subtotal * config.bundleDiscountPercent / 100)}</span>
            </div>
          )}

          {modifiers.customDiscountPercent > 0 && (
            <div className="flex justify-between text-sm font-bold font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
              <span>Custom Discount ({modifiers.customDiscountPercent}%)</span>
              <span>
                -{formatCurrency(
                  (modifiers.bundleDiscountApplied
                    ? subtotal * (1 - config.bundleDiscountPercent / 100)
                    : subtotal) * modifiers.customDiscountPercent / 100
                )}
              </span>
            </div>
          )}

          {modifiers.rushFee && (
            <div className="flex justify-between text-sm font-bold font-[family-name:var(--font-mono)] text-[var(--color-brand-red)]">
              <span>Rush Fee ({config.rushFeePercent}%)</span>
              <span>+{formatCurrency(beforeTax - beforeTax / (1 + config.rushFeePercent / 100))}</span>
            </div>
          )}

          {modifiers.includeTax && taxAmount > 0 && (
            <>
              <div className="flex justify-between text-sm border-t border-[var(--color-ink)]/20 pt-2 font-[family-name:var(--font-mono)]">
                <span className="text-[var(--color-ink-light)]">Before Tax</span>
                <span className="text-[var(--color-ink)]">{formatCurrency(beforeTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-[family-name:var(--font-mono)] text-[var(--color-ink-light)]">
                <span>Tax ({config.taxPercent}%)</span>
                <span>+{formatCurrency(taxAmount)}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t-2 border-[var(--color-ink)] pt-5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
              Total
            </span>
            <span className="text-3xl font-extrabold text-[var(--color-brand-red)] font-[family-name:var(--font-display)]">
              {formatCurrency(total)}
            </span>
          </div>
          <p className="text-xs text-[var(--color-ink-light)] mt-2 font-[family-name:var(--font-mono)]">
            Includes {config.revisionsIncluded} revision(s) per item
            {modifiers.includeTax && ` • Tax included`}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button variant="secondary" onClick={handleCopy} className="flex-1">
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
        {onSave && (
          <Button onClick={onSave} className="flex-1" disabled={!canSave}>
            Save Quote
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
