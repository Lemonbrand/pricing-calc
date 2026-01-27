import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { QuotesData, Client, Quote } from '../types';

const STORAGE_KEY = 'pricing-calc-quotes';

const defaultQuotesData: QuotesData = {
  clients: {},
};

export function useQuotes() {
  const [quotesData, setQuotesData] = useState<QuotesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const savedQuotes = localStorage.getItem(STORAGE_KEY);
        if (savedQuotes) {
          setQuotesData(JSON.parse(savedQuotes));
          setLoading(false);
          return;
        }

        // Load from default JSON file
        const response = await fetch('/data/quotes.json');
        if (!response.ok) {
          throw new Error('Failed to load quotes');
        }
        const data = await response.json();
        setQuotesData(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Error loading quotes:', err);
        setQuotesData(defaultQuotesData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuotesData));
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, []);

  const addClient = useCallback((name: string, email: string): Client => {
    const id = uuidv4();
    const newClient: Client = {
      id,
      name,
      email,
      quotes: [],
    };

    setQuotesData((prev) => {
      const updated = {
        ...prev!,
        clients: {
          ...prev!.clients,
          [id]: newClient,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newClient;
  }, []);

  const updateClient = useCallback((clientId: string, name: string, email: string) => {
    setQuotesData((prev) => {
      if (!prev || !prev.clients[clientId]) return prev;
      const updated = {
        ...prev,
        clients: {
          ...prev.clients,
          [clientId]: {
            ...prev.clients[clientId],
            name,
            email,
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setQuotesData((prev) => {
      if (!prev) return prev;
      const { [clientId]: _, ...rest } = prev.clients;
      const updated = { ...prev, clients: rest };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addQuote = useCallback((clientId: string, quote: Omit<Quote, 'id' | 'createdAt'>): Quote => {
    const newQuote: Quote = {
      ...quote,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setQuotesData((prev) => {
      if (!prev || !prev.clients[clientId]) return prev;
      const updated = {
        ...prev,
        clients: {
          ...prev.clients,
          [clientId]: {
            ...prev.clients[clientId],
            quotes: [...prev.clients[clientId].quotes, newQuote],
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newQuote;
  }, []);

  const deleteQuote = useCallback((clientId: string, quoteId: string) => {
    setQuotesData((prev) => {
      if (!prev || !prev.clients[clientId]) return prev;
      const updated = {
        ...prev,
        clients: {
          ...prev.clients,
          [clientId]: {
            ...prev.clients[clientId],
            quotes: prev.clients[clientId].quotes.filter((q) => q.id !== quoteId),
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getClients = useCallback((): Client[] => {
    if (!quotesData) return [];
    return Object.values(quotesData.clients);
  }, [quotesData]);

  const getClient = useCallback((clientId: string): Client | undefined => {
    if (!quotesData) return undefined;
    return quotesData.clients[clientId];
  }, [quotesData]);

  return {
    quotesData,
    loading,
    addClient,
    updateClient,
    deleteClient,
    addQuote,
    deleteQuote,
    getClients,
    getClient,
  };
}
