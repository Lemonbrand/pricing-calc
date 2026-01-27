import { useState } from 'react';
import { Button, Card, CardHeader, CardContent, Input } from './ui';
import type { Client, Quote, Config } from '../types';
import { DELIVERABLE_LABELS } from '../types';
import { formatCurrency } from '../utils/pricing';

interface ClientListProps {
  clients: Client[];
  config: Config;
  onDeleteClient: (clientId: string) => void;
  onDeleteQuote: (clientId: string, quoteId: string) => void;
  onDuplicateQuote: (quote: Quote) => void;
  onUpdateClient: (clientId: string, name: string, email: string) => void;
}

export function ClientList({
  clients,
  config,
  onDeleteClient,
  onDeleteQuote,
  onDuplicateQuote,
  onUpdateClient,
}: ClientListProps) {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const handleStartEdit = (client: Client) => {
    setEditingClient(client.id);
    setEditName(client.name);
    setEditEmail(client.email);
  };

  const handleSaveEdit = (clientId: string) => {
    if (editName.trim()) {
      onUpdateClient(clientId, editName.trim(), editEmail.trim());
    }
    setEditingClient(null);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setEditName('');
    setEditEmail('');
  };

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-[var(--color-ink)] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--color-ink)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] mb-2 font-[family-name:var(--font-display)]">
            No clients yet
          </h3>
          <p className="text-[var(--color-ink-light)] font-[family-name:var(--font-mono)]">
            Create a quote to add your first client.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardHeader
            className="cursor-pointer hover:bg-[var(--color-cream)]/50 transition-colors"
            onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
          >
            <div className="flex items-center justify-between">
              {editingClient === client.id ? (
                <div className="flex-1 flex gap-4 items-end" onClick={(e) => e.stopPropagation()}>
                  <Input
                    label="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    label="Email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-2 pb-0.5">
                    <Button size="sm" onClick={() => handleSaveEdit(client.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)] font-[family-name:var(--font-display)]">
                      {client.name}
                    </h3>
                    {client.email && (
                      <p className="text-sm text-[var(--color-ink-light)] font-[family-name:var(--font-mono)]">
                        {client.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-ink-light)] font-[family-name:var(--font-display)]">
                      {client.quotes.length} quote{client.quotes.length !== 1 ? 's' : ''}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[var(--color-ink)] transition-transform duration-100 ${
                        expandedClient === client.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </CardHeader>

          {expandedClient === client.id && (
            <CardContent className="border-t-2 border-[var(--color-ink)]">
              <div className="flex gap-2 mb-5">
                <Button size="sm" variant="secondary" onClick={() => handleStartEdit(client)}>
                  Edit Client
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Delete ${client.name} and all their quotes?`)) {
                      onDeleteClient(client.id);
                    }
                  }}
                >
                  Delete Client
                </Button>
              </div>

              {client.quotes.length === 0 ? (
                <p className="text-[var(--color-ink-light)] text-sm py-4 font-[family-name:var(--font-mono)]">
                  No quotes for this client yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {client.quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-light)] font-[family-name:var(--font-display)]">
                            {quote.createdAt}
                          </p>
                          <p className="text-xl font-extrabold text-[var(--color-ink)] font-[family-name:var(--font-display)] mt-1">
                            {formatCurrency(quote.total)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onDuplicateQuote(quote)}
                          >
                            Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              if (confirm('Delete this quote?')) {
                                onDeleteQuote(client.id, quote.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-[var(--color-ink-light)] font-[family-name:var(--font-mono)]">
                        {quote.items.map((item, index) => (
                          <span key={item.id}>
                            {DELIVERABLE_LABELS[item.type]}
                            {index < quote.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {quote.modifiers.bundleDiscountApplied && (
                          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[var(--color-ink)] text-white font-[family-name:var(--font-display)]">
                            Bundle ({config.bundleDiscountPercent}% off)
                          </span>
                        )}
                        {quote.modifiers.customDiscountPercent > 0 && (
                          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[var(--color-ink)] text-white font-[family-name:var(--font-display)]">
                            Discount ({quote.modifiers.customDiscountPercent}%)
                          </span>
                        )}
                        {quote.modifiers.rushFee && (
                          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[var(--color-brand-red)] text-white font-[family-name:var(--font-display)]">
                            Rush (+{config.rushFeePercent}%)
                          </span>
                        )}
                        {quote.modifiers.includeTax && (
                          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-[family-name:var(--font-display)]">
                            Tax included
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
