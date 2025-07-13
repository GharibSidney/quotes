import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
import { Quote } from "@/entities/Quote";
import { Input } from "@/components/ui/input";

import QuoteGrid from "../components/quotes/QuoteGrid";

export default function FavoritesPage() {
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await Quote.filter({ is_favorite: true }, "-created_date");
      setFavoriteQuotes(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setIsLoading(false);
  };

  const filteredQuotes = favoriteQuotes.filter(quote => {
    return quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quote.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-current" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Favorite Quotes
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your most cherished quotes, all in one place
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites..."
              className="pl-12 rounded-xl border-gray-200 bg-white/80 ios-blur text-center"
            />
          </div>
        </motion.div>

        {/* Favorites Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {!isLoading && filteredQuotes.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {favoriteQuotes.length === 0 
                  ? "Start liking quotes to build your favorites collection!"
                  : "No quotes match your search. Try a different keyword."
                }
              </p>
            </div>
          ) : (
            <QuoteGrid 
              quotes={filteredQuotes} 
              onUpdate={loadFavorites} 
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}