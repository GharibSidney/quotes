import * as SQLite from 'expo-sqlite';
import { Quote } from '../types/Quote';

class DatabaseService {
  private db: SQLite.WebSQLDatabase;

  constructor() {
    this.db = SQLite.openDatabase('quotes.db');
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS quotes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          author TEXT NOT NULL,
          category TEXT DEFAULT 'inspiration',
          background_color TEXT DEFAULT 'blue',
          is_favorite INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
    });
  }

  async getAllQuotes(): Promise<Quote[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM quotes ORDER BY created_at DESC',
          [],
          (_, { rows }) => {
            const quotes: Quote[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              quotes.push({
                id: row.id,
                text: row.text,
                author: row.author,
                category: row.category,
                background_color: row.background_color,
                is_favorite: Boolean(row.is_favorite)
              });
            }
            resolve(quotes);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async createQuote(quote: Omit<Quote, 'id'>): Promise<Quote> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO quotes (text, author, category, background_color, is_favorite) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            quote.text,
            quote.author,
            quote.category || 'inspiration',
            quote.background_color || 'blue',
            quote.is_favorite ? 1 : 0
          ],
          (_, { insertId }) => {
            if (insertId) {
              resolve({
                id: insertId,
                ...quote,
                category: quote.category || 'inspiration',
                background_color: quote.background_color || 'blue',
                is_favorite: quote.is_favorite || false
              });
            } else {
              reject(new Error('Failed to create quote'));
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async updateQuote(id: number, updates: Partial<Omit<Quote, 'id'>>): Promise<Quote> {
    return new Promise((resolve, reject) => {
      // First, get the current quote
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM quotes WHERE id = ?',
          [id],
          (_, { rows }) => {
            if (rows.length === 0) {
              reject(new Error('Quote not found'));
              return;
            }

            const currentQuote = rows.item(0);
            const updatedQuote = {
              text: updates.text !== undefined ? updates.text : currentQuote.text,
              author: updates.author !== undefined ? updates.author : currentQuote.author,
              category: updates.category !== undefined ? updates.category : currentQuote.category,
              background_color: updates.background_color !== undefined ? updates.background_color : currentQuote.background_color,
              is_favorite: updates.is_favorite !== undefined ? (updates.is_favorite ? 1 : 0) : currentQuote.is_favorite
            };

            // Update the quote
            tx.executeSql(
              `UPDATE quotes SET text = ?, author = ?, category = ?, background_color = ?, is_favorite = ? 
               WHERE id = ?`,
              [
                updatedQuote.text,
                updatedQuote.author,
                updatedQuote.category,
                updatedQuote.background_color,
                updatedQuote.is_favorite,
                id
              ],
              () => {
                resolve({
                  id,
                  text: updatedQuote.text,
                  author: updatedQuote.author,
                  category: updatedQuote.category,
                  background_color: updatedQuote.background_color,
                  is_favorite: Boolean(updatedQuote.is_favorite)
                });
              },
              (_, error) => {
                reject(error);
                return false;
              }
            );
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async deleteQuote(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM quotes WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getFavoriteQuotes(): Promise<Quote[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM quotes WHERE is_favorite = 1 ORDER BY created_at DESC',
          [],
          (_, { rows }) => {
            const quotes: Quote[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              quotes.push({
                id: row.id,
                text: row.text,
                author: row.author,
                category: row.category,
                background_color: row.background_color,
                is_favorite: Boolean(row.is_favorite)
              });
            }
            resolve(quotes);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async seedInitialData(): Promise<void> {
    const initialQuotes = [
      { 
        text: "The best way to get started is to quit talking and begin doing.", 
        author: "Walt Disney", 
        category: "motivation" as const, 
        background_color: "blue" as const, 
        is_favorite: false 
      },
      { 
        text: "Don't let yesterday take up too much of today.", 
        author: "Will Rogers", 
        category: "inspiration" as const, 
        background_color: "green" as const, 
        is_favorite: false 
      },
      { 
        text: "The way to get started is to quit talking and begin doing.", 
        author: "Walt Disney", 
        category: "motivation" as const, 
        background_color: "purple" as const, 
        is_favorite: false 
      },
      { 
        text: "Life is what happens to you while you're busy making other plans.", 
        author: "John Lennon", 
        category: "life" as const, 
        background_color: "orange" as const, 
        is_favorite: false 
      }
    ];

    // Check if we already have data
    const existingQuotes = await this.getAllQuotes();
    if (existingQuotes.length === 0) {
      // Seed initial data
      for (const quote of initialQuotes) {
        await this.createQuote(quote);
      }
    }
  }
}

export default new DatabaseService();
