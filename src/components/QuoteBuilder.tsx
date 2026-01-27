import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Card, CardHeader, CardContent, Select, Input, Toggle, Slider } from './ui';
import { QuoteItem } from './QuoteItem';
import { QuoteSummary } from './QuoteSummary';
import type {
  Config,
  QuoteItem as QuoteItemType,
  QuoteModifiers,
  Client,
  DeliverableType,
  ComplexityTier,
  PresetTier,
} from '../types';
import { PRESET_BUNDLES } from '../types';
import {
  calculateItemPrice,
  calculateSubtotal,
  calculateTotal,
  shouldApplyBundleDiscount,
} from '../utils/pricing';

interface QuoteBuilderProps {
  config: Config;
  clients: Client[];
  onAddClient: (name: string, email: string) => Client;
  onSaveQuote: (clientId: string, quote: { items: QuoteItemType[]; modifiers: QuoteModifiers; subtotal: number; taxAmount: number; total: number }) => void;
  initialQuote?: { items: QuoteItemType[]; modifiers: QuoteModifiers } | null;
}

const DEFAULT_MODIFIERS: QuoteModifiers = {
  rushFee: false,
  customDiscountPercent: 0,
  bundleDiscountApplied: false,
  includeTax: true,
};

export function QuoteBuilder({
  config,
  clients,
  onAddClient,
  onSaveQuote,
  initialQuote,
}: QuoteBuilderProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const createItemFromPreset = (type: DeliverableType, complexity: ComplexityTier): QuoteItemType => {
    const { basePrice, calculatedPrice } = calculateItemPrice(type, complexity, 0, config);
    return {
      id: uuidv4(),
      type,
      complexity,
      extraRevisions: 0,
      basePrice,
      calculatedPrice,
    };
  };

  const createDefaultItems = (): QuoteItemType[] => {
    // Start with a simple landing page as default
    return [createItemFromPreset('landingPage', 'simple')];
  };

  const [items, setItems] = useState<QuoteItemType[]>(initialQuote?.items || createDefaultItems());
  const [modifiers, setModifiers] = useState<QuoteModifiers>(
    initialQuote?.modifiers || { ...DEFAULT_MODIFIERS }
  );

  // Update bundle discount when items change
  useEffect(() => {
    const shouldBundle = shouldApplyBundleDiscount(items);
    if (shouldBundle !== modifiers.bundleDiscountApplied) {
      setModifiers((prev) => ({ ...prev, bundleDiscountApplied: shouldBundle }));
    }
  }, [items, modifiers.bundleDiscountApplied]);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const totals = useMemo(() => calculateTotal(subtotal, modifiers, config), [subtotal, modifiers, config]);

  const createNewItem = (type: DeliverableType = 'landingPage'): QuoteItemType => {
    const { basePrice, calculatedPrice } = calculateItemPrice(type, 'simple', 0, config);
    return {
      id: uuidv4(),
      type,
      complexity: 'simple',
      extraRevisions: 0,
      basePrice,
      calculatedPrice,
    };
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, createNewItem()]);
  };

  const handleUpdateItem = (id: string, updates: Partial<Pick<QuoteItemType, 'type' | 'complexity' | 'extraRevisions'>>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, ...updates };
        const { basePrice, calculatedPrice } = calculateItemPrice(
          updatedItem.type,
          updatedItem.complexity,
          updatedItem.extraRevisions,
          config
        );

        return { ...updatedItem, basePrice, calculatedPrice };
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPreset = (tier: PresetTier) => {
    const preset = PRESET_BUNDLES[tier];
    const newItems = preset.items.map((item) => createItemFromPreset(item.type, item.complexity));
    setItems(newItems);
    setModifiers({ ...DEFAULT_MODIFIERS, bundleDiscountApplied: newItems.length >= 2 });
  };

  const handleClearQuote = () => {
    setItems([]);
    setModifiers({ ...DEFAULT_MODIFIERS, bundleDiscountApplied: false });
  };

  const handleResetToDefault = () => {
    setItems(createDefaultItems());
    setModifiers({ ...DEFAULT_MODIFIERS, bundleDiscountApplied: false });
  };

  const handleAddNewClient = () => {
    if (!newClientName.trim()) return;

    const newClient = onAddClient(newClientName.trim(), newClientEmail.trim());
    setSelectedClientId(newClient.id);
    setNewClientName('');
    setNewClientEmail('');
    setShowNewClientForm(false);
  };

  const handleSaveQuote = () => {
    if (!selectedClientId || items.length === 0) return;

    onSaveQuote(selectedClientId, {
      items,
      modifiers,
      subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
    });
    // Quote state preserved after saving
  };

  const clientOptions = [
    { value: '', label: 'Select a client...' },
    ...clients.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Quick Start Presets */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Quick Start
          </h2>
          <p className="text-sm text-[var(--color-ink-light)] mt-1 font-[family-name:var(--font-mono)]">
            Choose a starting point and customize from there
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(PRESET_BUNDLES) as PresetTier[]).map((tier) => {
              const preset = PRESET_BUNDLES[tier];
              return (
                <button
                  key={tier}
                  onClick={() => handleApplyPreset(tier)}
                  className="
                    p-5
                    bg-white border-2 border-[var(--color-ink)]
                    shadow-[var(--shadow-brutal-sm)]
                    hover:shadow-[var(--shadow-brutal)] hover:translate-x-[-2px] hover:translate-y-[-2px]
                    active:shadow-none active:translate-x-0 active:translate-y-0
                    transition-all duration-100
                    text-left
                    group
                  "
                >
                  <div className="font-bold uppercase tracking-wide text-[var(--color-ink)] group-hover:text-[var(--color-brand-red)] transition-colors font-[family-name:var(--font-display)]">
                    {preset.name}
                  </div>
                  <div className="text-sm text-[var(--color-ink-light)] mt-2 font-[family-name:var(--font-mono)]">
                    {preset.description}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-light)]/60 mt-3 font-[family-name:var(--font-display)]">
                    {preset.items.length} item{preset.items.length > 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Client
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showNewClientForm ? (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Select
                  label="Select Client"
                  options={clientOptions}
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                />
              </div>
              <Button variant="secondary" onClick={() => setShowNewClientForm(true)}>
                New Client
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Client Name"
                  placeholder="Acme Corp"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="contact@acme.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddNewClient} disabled={!newClientName.trim()}>
                  Add Client
                </Button>
                <Button variant="ghost" onClick={() => setShowNewClientForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Deliverables
          </h2>
          <div className="flex gap-2">
            {items.length > 0 && (
              <Button variant="ghost" onClick={handleClearQuote} size="sm">
                Clear All
              </Button>
            )}
            <Button onClick={handleAddItem} size="sm">
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-[var(--color-ink)]/30">
              <p className="text-[var(--color-ink-light)] mb-4 font-[family-name:var(--font-mono)]">
                No items yet. Start fresh or use a preset above.
              </p>
              <Button variant="secondary" onClick={handleResetToDefault}>
                Add Default Item
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <QuoteItem
                key={item.id}
                item={item}
                config={config}
                onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Modifiers */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Quote Options
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggles row */}
          <div className="flex flex-wrap gap-6">
            <Toggle
              label={`Rush Fee (+${config.rushFeePercent}%)`}
              checked={modifiers.rushFee}
              onChange={(checked) => setModifiers((prev) => ({ ...prev, rushFee: checked }))}
            />

            <Toggle
              label={`Include Tax (${config.taxPercent}%)`}
              checked={modifiers.includeTax}
              onChange={(checked) => setModifiers((prev) => ({ ...prev, includeTax: checked }))}
            />

            {modifiers.bundleDiscountApplied && (
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-ink)] bg-[var(--color-cream)] border-2 border-[var(--color-ink)] px-3 py-2 shadow-[var(--shadow-brutal-sm)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bundle ({config.bundleDiscountPercent}% off)
              </div>
            )}
          </div>

          {/* Discount slider */}
          <div className="max-w-md">
            <Slider
              label="Custom Discount"
              value={modifiers.customDiscountPercent}
              min={0}
              max={50}
              step={5}
              onChange={(value) => setModifiers((prev) => ({ ...prev, customDiscountPercent: value }))}
              formatValue={(v) => `${v}%`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <QuoteSummary
        items={items}
        modifiers={modifiers}
        subtotal={subtotal}
        beforeTax={totals.beforeTax}
        taxAmount={totals.taxAmount}
        total={totals.total}
        config={config}
        onSave={handleSaveQuote}
        canSave={!!selectedClientId && items.length > 0}
      />
    </div>
  );
}
