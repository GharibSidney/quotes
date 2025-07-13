export type QuoteCategory = 
  | 'inspiration'
  | 'motivation'
  | 'love'
  | 'wisdom'
  | 'success'
  | 'life'
  | 'happiness'
  | 'friendship';

export type QuoteBackgroundColor = 
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'teal';

export interface Quote {
  id?: number;
  text: string;
  author: string;
  category?: QuoteCategory;
  background_color?: QuoteBackgroundColor;
  is_favorite?: boolean;
}

export interface CreateQuoteData {
  text: string;
  author: string;
  category?: QuoteCategory;
  background_color?: QuoteBackgroundColor;
  is_favorite?: boolean;
}

export interface UpdateQuoteData {
  text?: string;
  author?: string;
  category?: QuoteCategory;
  background_color?: QuoteBackgroundColor;
  is_favorite?: boolean;
}
