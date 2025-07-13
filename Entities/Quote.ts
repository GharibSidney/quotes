import QuoteService from '../services/QuoteService';
import { Quote as QuoteType, CreateQuoteData, UpdateQuoteData } from '../types/Quote';

export const Quote = {
  create: async (quoteData: CreateQuoteData): Promise<QuoteType> => {
    return await QuoteService.create(quoteData);
  },
  
  list: async (): Promise<QuoteType[]> => {
    return await QuoteService.list();
  },
  
  update: async (id: number, updatedData: UpdateQuoteData): Promise<QuoteType> => {
    return await QuoteService.update(id, updatedData);
  }
};

export default Quote;
