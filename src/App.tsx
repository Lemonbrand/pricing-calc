import { useState, useCallback } from 'react';
import { QuoteBuilder } from './components/QuoteBuilder';
import { ClientList } from './components/ClientList';
import { Settings } from './components/Settings';
import { useConfig } from './hooks/useConfig';
import { useQuotes } from './hooks/useQuotes';
import type { Quote, QuoteItem, QuoteModifiers } from './types';

type Tab = 'quote' | 'clients' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quote');
  const [duplicateQuote, setDuplicateQuote] = useState<{ items: QuoteItem[]; modifiers: QuoteModifiers } | null>(null);

  const { config, loading: configLoading, saveConfig, resetConfig } = useConfig();
  const {
    loading: quotesLoading,
    addClient,
    updateClient,
    deleteClient,
    addQuote,
    deleteQuote,
    getClients,
  } = useQuotes();

  const handleSaveQuote = useCallback(
    (clientId: string, quote: { items: QuoteItem[]; modifiers: QuoteModifiers; subtotal: number; taxAmount: number; total: number }) => {
      addQuote(clientId, quote);
      setDuplicateQuote(null);
    },
    [addQuote]
  );

  const handleDuplicateQuote = useCallback((quote: Quote) => {
    setDuplicateQuote({
      items: quote.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
      modifiers: { ...quote.modifiers },
    });
    setActiveTab('quote');
  }, []);

  if (configLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-ink)] border-t-[var(--color-brand-red)] animate-spin mx-auto mb-6"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-ink-light)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white border-2 border-[var(--color-ink)] shadow-[var(--shadow-brutal)] p-8 text-center">
          <p className="text-[var(--color-brand-red)] font-bold uppercase tracking-wide">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  const clients = getClients();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'quote', label: 'New Quote' },
    { id: 'clients', label: 'Clients' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-[var(--color-brand-red)] border-b-4 border-[var(--color-ink)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight font-[family-name:var(--font-display)]">
              Pricing Calculator
            </h1>
            {config.business.name && config.business.name !== 'Your Name/Company' && (
              <span className="text-sm font-mono text-white/80 bg-[var(--color-ink)]/20 px-3 py-1 border border-white/30">
                {config.business.name}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b-4 border-[var(--color-ink)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative py-4 px-6
                  font-bold text-sm uppercase tracking-wide
                  transition-colors duration-100
                  font-[family-name:var(--font-display)]
                  ${
                    activeTab === tab.id
                      ? 'text-[var(--color-brand-red)] bg-[var(--color-cream)]'
                      : 'text-[var(--color-ink-light)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream)]/50'
                  }
                `}
              >
                {tab.label}
                {tab.id === 'clients' && clients.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--color-ink)] text-white font-mono">
                    {clients.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-brand-red)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'quote' && (
          <QuoteBuilder
            config={config}
            clients={clients}
            onAddClient={addClient}
            onSaveQuote={handleSaveQuote}
            initialQuote={duplicateQuote}
          />
        )}

        {activeTab === 'clients' && (
          <ClientList
            clients={clients}
            config={config}
            onDeleteClient={deleteClient}
            onDeleteQuote={deleteQuote}
            onDuplicateQuote={handleDuplicateQuote}
            onUpdateClient={updateClient}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            config={config}
            onSave={saveConfig}
            onReset={resetConfig}
          />
        )}
      </main>
    </div>
  );
}

export default App;
