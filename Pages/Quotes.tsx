import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Quote } from "@/entities/Quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import CreateQuoteModal from "../components/quotes/CreateQuoteModal";
import QuoteGrid from "../components/quotes/QuoteGrid";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const data = await Quote.list("-created_date");
      setQuotes(data);
    } catch (error) {
      console.error("Error loading quotes:", error);
    }
    setIsLoading(false);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || quote.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Your Quote
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {" "}Collection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curate and display your favorite quotes in beautiful, shareable widgets
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes or authors..."
              className="pl-12 rounded-xl border-gray-200 bg-white/80 ios-blur"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 rounded-xl border-gray-200 bg-white/80 ios-blur">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="inspiration">Inspiration</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
                <SelectItem value="love">Love</SelectItem>
                <SelectItem value="wisdom">Wisdom</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="life">Life</SelectItem>
                <SelectItem value="happiness">Happiness</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white widget-shadow button-bounce"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Quote
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/80 ios-blur rounded-2xl p-4 text-center widget-shadow">
            <div className="text-2xl font-bold text-gray-900">{quotes.length}</div>
            <div className="text-sm text-gray-600">Total Quotes</div>
          </div>
          <div className="bg-white/80 ios-blur rounded-2xl p-4 text-center widget-shadow">
            <div className="text-2xl font-bold text-red-500">{quotes.filter(q => q.is_favorite).length}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div className="bg-white/80 ios-blur rounded-2xl p-4 text-center widget-shadow">
            <div className="text-2xl font-bold text-blue-500">{new Set(quotes.map(q => q.author)).size}</div>
            <div className="text-sm text-gray-600">Authors</div>
          </div>
          <div className="bg-white/80 ios-blur rounded-2xl p-4 text-center widget-shadow">
            <div className="text-2xl font-bold text-purple-500">{new Set(quotes.map(q => q.category)).size}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </motion.div>

        {/* Quotes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuoteGrid 
            quotes={filteredQuotes} 
            onUpdate={loadQuotes} 
            isLoading={isLoading}
          />
        </motion.div>

        {/* Create Quote Modal */}
        <CreateQuoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadQuotes}
        />
      </div>
    </div>
  );
}