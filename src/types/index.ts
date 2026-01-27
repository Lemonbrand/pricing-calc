export type DeliverableType =
  | 'landingPage'
  | 'fullWebsite'
  | 'copywriting'
  | 'designConsultation'
  | 'contentStrategy'
  | 'seoSetup'
  | 'analyticsSetup'
  | 'brandGuidelines'
  | 'socialMediaKit'
  | 'maintenanceHours';

export type ComplexityTier = 'simple' | 'medium' | 'complex';

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Config {
  business: BusinessInfo;
  hourlyRate: number;
  baseRates: Record<DeliverableType, number>;
  complexityMultipliers: Record<ComplexityTier, number>;
  rushFeePercent: number;
  revisionsIncluded: number;
  extraRevisionRate: number;
  bundleDiscountPercent: number;
  taxPercent: number;
}

export type PresetTier = 'good' | 'better' | 'best';

export interface PresetBundle {
  name: string;
  description: string;
  items: Array<{ type: DeliverableType; complexity: ComplexityTier }>;
}

export interface QuoteItem {
  id: string;
  type: DeliverableType;
  complexity: ComplexityTier;
  extraRevisions: number;
  basePrice: number;
  calculatedPrice: number;
}

export interface QuoteModifiers {
  rushFee: boolean;
  customDiscountPercent: number;
  bundleDiscountApplied: boolean;
  includeTax: boolean;
}

export interface Quote {
  id: string;
  createdAt: string;
  items: QuoteItem[];
  modifiers: QuoteModifiers;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  quotes: Quote[];
}

export interface QuotesData {
  clients: Record<string, Client>;
}

export const DELIVERABLE_LABELS: Record<DeliverableType, string> = {
  landingPage: 'Landing Page',
  fullWebsite: 'Full Website',
  copywriting: 'Copywriting',
  designConsultation: 'Design Consultation',
  contentStrategy: 'Content Strategy',
  seoSetup: 'SEO Setup',
  analyticsSetup: 'Analytics Setup',
  brandGuidelines: 'Brand Guidelines',
  socialMediaKit: 'Social Media Kit',
  maintenanceHours: 'Maintenance (per hour)',
};

export const COMPLEXITY_LABELS: Record<ComplexityTier, string> = {
  simple: 'Simple',
  medium: 'Medium',
  complex: 'Complex',
};

export const PRESET_BUNDLES: Record<PresetTier, PresetBundle> = {
  good: {
    name: 'Starter',
    description: 'Landing page with basic copy and analytics tracking',
    items: [
      { type: 'designConsultation', complexity: 'simple' },
      { type: 'landingPage', complexity: 'simple' },
      { type: 'copywriting', complexity: 'simple' },
      { type: 'analyticsSetup', complexity: 'simple' },
    ],
  },
  better: {
    name: 'Professional',
    description: 'Enhanced landing page with SEO, content strategy, and optimization',
    items: [
      { type: 'designConsultation', complexity: 'medium' },
      { type: 'contentStrategy', complexity: 'simple' },
      { type: 'landingPage', complexity: 'medium' },
      { type: 'copywriting', complexity: 'medium' },
      { type: 'seoSetup', complexity: 'simple' },
      { type: 'analyticsSetup', complexity: 'medium' },
    ],
  },
  best: {
    name: 'Complete Package',
    description: 'Full website with brand identity, content, SEO, and ongoing support',
    items: [
      { type: 'designConsultation', complexity: 'complex' },
      { type: 'brandGuidelines', complexity: 'medium' },
      { type: 'contentStrategy', complexity: 'medium' },
      { type: 'fullWebsite', complexity: 'medium' },
      { type: 'copywriting', complexity: 'complex' },
      { type: 'seoSetup', complexity: 'medium' },
      { type: 'analyticsSetup', complexity: 'medium' },
      { type: 'socialMediaKit', complexity: 'simple' },
    ],
  },
};
