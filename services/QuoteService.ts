import { Quote, CreateQuoteData, UpdateQuoteData } from '../types/Quote';

const quotes: Quote[] = [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "motivation", background_color: "blue", is_favorite: false },
  { id: 2, text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "inspiration", background_color: "green", is_favorite: false },
  // Add more quotes as needed
];

export default {
  list: async (): Promise<Quote[]> => {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => resolve([...quotes]), 100);
    });
  },

  create: async (quote: CreateQuoteData): Promise<Quote> => {
    return new Promise((resolve, reject) => {
      try {
        // Validate required fields
        if (!quote.text || !quote.author) {
          reject(new Error('Text and author are required'));
          return;
        }
        
        // Assign a new id (incremental)
        const newId = quotes.length ? Math.max(...quotes.map(q => q.id!)) + 1 : 1;
        const newQuote: Quote = { 
          id: newId, 
          text: quote.text.trim(),
          author: quote.author.trim(),
          category: quote.category || 'inspiration',
          background_color: quote.background_color || 'blue',
          is_favorite: quote.is_favorite || false
        };
        
        quotes.push(newQuote);
        
        // Simulate async operation
        setTimeout(() => resolve(newQuote), 100);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: async (id: number, updatedQuote: UpdateQuoteData): Promise<Quote> => {
    return new Promise((resolve, reject) => {
      try {
        const index = quotes.findIndex(q => q.id === id);
        if (index === -1) {
          reject(new Error('Quote not found'));
          return;
        }
        
        // Update the quote
        quotes[index] = { ...quotes[index], ...updatedQuote };
        
        // Simulate async operation
        setTimeout(() => resolve(quotes[index]), 100);
      } catch (error) {
        reject(error);
      }
    });
  },

  getFavorites: async (): Promise<Quote[]> => {
    // Simulate async operation
    return new Promise((resolve) => {
      const favorites = quotes.filter(quote => quote.is_favorite);
      setTimeout(() => resolve([...favorites]), 100);
    });
  },
};
