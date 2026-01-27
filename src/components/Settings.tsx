import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardContent, CardFooter, Input } from './ui';
import type { Config, DeliverableType, ComplexityTier } from '../types';
import { DELIVERABLE_LABELS, COMPLEXITY_LABELS } from '../types';

interface SettingsProps {
  config: Config;
  onSave: (config: Config) => void;
  onReset: () => void;
}

export function Settings({ config, onSave, onReset }: SettingsProps) {
  const [formData, setFormData] = useState<Config>(config);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(config);
    setHasChanges(false);
  }, [config]);

  const handleChange = <K extends keyof Config>(key: K, value: Config[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleBusinessChange = (key: keyof Config['business'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      business: { ...prev.business, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleBaseRateChange = (key: DeliverableType, value: number) => {
    setFormData((prev) => ({
      ...prev,
      baseRates: { ...prev.baseRates, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleMultiplierChange = (key: ComplexityTier, value: number) => {
    setFormData((prev) => ({
      ...prev,
      complexityMultipliers: { ...prev.complexityMultipliers, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Business Information
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Business Name"
            value={formData.business.name}
            onChange={(e) => handleBusinessChange('name', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.business.email}
              onChange={(e) => handleBusinessChange('email', e.target.value)}
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.business.phone}
              onChange={(e) => handleBusinessChange('phone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Pricing
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Hourly Rate ($)"
            type="number"
            min="0"
            value={formData.hourlyRate}
            onChange={(e) => handleChange('hourlyRate', Number(e.target.value) || 0)}
          />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] mb-4 font-[family-name:var(--font-display)]">
              Base Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.keys(DELIVERABLE_LABELS) as DeliverableType[]).map((type) => (
                <Input
                  key={type}
                  label={DELIVERABLE_LABELS[type]}
                  type="number"
                  min="0"
                  value={formData.baseRates[type]}
                  onChange={(e) => handleBaseRateChange(type, Number(e.target.value) || 0)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] mb-4 font-[family-name:var(--font-display)]">
              Complexity Multipliers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.keys(COMPLEXITY_LABELS) as ComplexityTier[]).map((tier) => (
                <Input
                  key={tier}
                  label={COMPLEXITY_LABELS[tier]}
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.complexityMultipliers[tier]}
                  onChange={(e) => handleMultiplierChange(tier, Number(e.target.value) || 0)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modifiers */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
            Quote Modifiers
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Rush Fee (%)"
              type="number"
              min="0"
              max="100"
              value={formData.rushFeePercent}
              onChange={(e) => handleChange('rushFeePercent', Number(e.target.value) || 0)}
            />
            <Input
              label="Bundle Discount (%)"
              type="number"
              min="0"
              max="100"
              value={formData.bundleDiscountPercent}
              onChange={(e) => handleChange('bundleDiscountPercent', Number(e.target.value) || 0)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Revisions Included"
              type="number"
              min="0"
              value={formData.revisionsIncluded}
              onChange={(e) => handleChange('revisionsIncluded', Number(e.target.value) || 0)}
            />
            <Input
              label="Extra Revision Rate ($)"
              type="number"
              min="0"
              value={formData.extraRevisionRate}
              onChange={(e) => handleChange('extraRevisionRate', Number(e.target.value) || 0)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tax Rate (%)"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.taxPercent}
              onChange={(e) => handleChange('taxPercent', Number(e.target.value) || 0)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="danger" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
