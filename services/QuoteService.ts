import { Quote, CreateQuoteData, UpdateQuoteData } from '../types/Quote';
import DatabaseService from './DatabaseService';

export default {
  list: async (): Promise<Quote[]> => {
    try {
      // Initialize database with seed data if needed
      await DatabaseService.seedInitialData();
      return await DatabaseService.getAllQuotes();
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  },

  create: async (quote: CreateQuoteData): Promise<Quote> => {
    try {
      // Validate required fields
      if (!quote.text || !quote.author) {
        throw new Error('Text and author are required');
      }
      
      const newQuote = {
        text: quote.text.trim(),
        author: quote.author.trim(),
        category: quote.category || 'inspiration',
        background_color: quote.background_color || 'blue',
        is_favorite: quote.is_favorite || false
      };
      
      return await DatabaseService.createQuote(newQuote);
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  },

  update: async (id: number, updatedQuote: UpdateQuoteData): Promise<Quote> => {
    try {
      return await DatabaseService.updateQuote(id, updatedQuote);
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await DatabaseService.deleteQuote(id);
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  },

  getFavorites: async (): Promise<Quote[]> => {
    try {
      return await DatabaseService.getFavoriteQuotes();
    } catch (error) {
      console.error('Error fetching favorite quotes:', error);
      throw error;
    }
  },
};
