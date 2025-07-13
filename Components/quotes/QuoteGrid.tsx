import React from "react";
import { motion } from "framer-motion";
import QuoteWidget from "./QuoteWidget";

export default function QuoteGrid({ quotes, onUpdate, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-3xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
          <span className="text-3xl">💭</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No quotes yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start building your collection of inspiring quotes. Create your first quote to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quotes.map((quote, index) => (
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuoteWidget quote={quote} onUpdate={onUpdate} />
        </motion.div>
      ))}
    </div>
  );
}