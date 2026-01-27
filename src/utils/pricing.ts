import type { Config, QuoteItem, QuoteModifiers, DeliverableType, ComplexityTier } from '../types';

export function calculateItemPrice(
  type: DeliverableType,
  complexity: ComplexityTier,
  extraRevisions: number,
  config: Config
): { basePrice: number; calculatedPrice: number } {
  const basePrice = config.baseRates[type];
  const multiplier = config.complexityMultipliers[complexity];
  const revisionCost = extraRevisions * config.extraRevisionRate;
  const calculatedPrice = basePrice * multiplier + revisionCost;

  return { basePrice, calculatedPrice };
}

export function calculateSubtotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + item.calculatedPrice, 0);
}

export interface TotalCalculation {
  beforeTax: number;
  taxAmount: number;
  total: number;
}

export function calculateTotal(
  subtotal: number,
  modifiers: QuoteModifiers,
  config: Config
): TotalCalculation {
  let beforeTax = subtotal;

  // Apply bundle discount if applicable
  if (modifiers.bundleDiscountApplied) {
    beforeTax = beforeTax * (1 - config.bundleDiscountPercent / 100);
  }

  // Apply custom discount
  if (modifiers.customDiscountPercent > 0) {
    beforeTax = beforeTax * (1 - modifiers.customDiscountPercent / 100);
  }

  // Apply rush fee
  if (modifiers.rushFee) {
    beforeTax = beforeTax * (1 + config.rushFeePercent / 100);
  }

  beforeTax = Math.round(beforeTax * 100) / 100;

  // Calculate tax
  const taxAmount = modifiers.includeTax
    ? Math.round(beforeTax * (config.taxPercent / 100) * 100) / 100
    : 0;

  const total = Math.round((beforeTax + taxAmount) * 100) / 100;

  return { beforeTax, taxAmount, total };
}

export function shouldApplyBundleDiscount(items: QuoteItem[]): boolean {
  return items.length >= 2;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
