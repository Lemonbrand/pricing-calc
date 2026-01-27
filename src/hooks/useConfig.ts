import { useState, useEffect, useCallback } from 'react';
import type { Config } from '../types';

const STORAGE_KEY = 'pricing-calc-config';

const defaultConfig: Config = {
  business: {
    name: 'Your Name/Company',
    email: 'you@example.com',
    phone: '',
  },
  hourlyRate: 150,
  baseRates: {
    landingPage: 2500,
    fullWebsite: 8000,
    copywriting: 500,
    designConsultation: 300,
    contentStrategy: 800,
    seoSetup: 600,
    analyticsSetup: 400,
    brandGuidelines: 1500,
    socialMediaKit: 1000,
    maintenanceHours: 150,
  },
  complexityMultipliers: {
    simple: 1.0,
    medium: 1.5,
    complex: 2.0,
  },
  rushFeePercent: 25,
  revisionsIncluded: 2,
  extraRevisionRate: 100,
  bundleDiscountPercent: 10,
  taxPercent: 13,
};

// Merge saved config with defaults to ensure new fields are added
function mergeWithDefaults(saved: Partial<Config>): Config {
  return {
    ...defaultConfig,
    ...saved,
    business: {
      ...defaultConfig.business,
      ...saved.business,
    },
    baseRates: {
      ...defaultConfig.baseRates,
      ...saved.baseRates,
    },
    complexityMultipliers: {
      ...defaultConfig.complexityMultipliers,
      ...saved.complexityMultipliers,
    },
  };
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        // First check localStorage for saved config
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
          // Merge with defaults to pick up any new fields
          const parsed = JSON.parse(savedConfig);
          const merged = mergeWithDefaults(parsed);
          setConfig(merged);
          // Save merged config back to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setLoading(false);
          return;
        }

        // Otherwise load from default JSON file
        const response = await fetch('/data/config.json');
        if (!response.ok) {
          throw new Error('Failed to load config');
        }
        const data = await response.json();
        const merged = mergeWithDefaults(data);
        setConfig(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.error('Error loading config:', err);
        // Use default config if fetch fails
        setConfig(defaultConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const saveConfig = useCallback((newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
  }, []);

  return { config, loading, saveConfig, resetConfig };
}
