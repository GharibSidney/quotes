import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share, Copy } from "lucide-react";
import { Quote } from "@/entities/Quote";
import { Button } from "@/components/ui/button";

const backgroundGradients = {
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600", 
  green: "from-green-400 to-green-600",
  orange: "from-orange-400 to-orange-600",
  pink: "from-pink-400 to-pink-600",
  teal: "from-teal-400 to-teal-600"
};

export default function QuoteWidget({ quote, onUpdate }) {
  const [isLiked, setIsLiked] = useState(quote.is_favorite);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    setIsAnimating(true);
    setIsLiked(!isLiked);
    
    try {
      await Quote.update(quote.id, { ...quote, is_favorite: !isLiked });
      if (onUpdate) onUpdate();
    } catch (error) {
      setIsLiked(!isLiked); // Revert on error
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Inspiring Quote',
        text: `"${quote.text}" - ${quote.author}`
      });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className={`
        relative w-full aspect-square rounded-3xl overflow-hidden
        bg-gradient-to-br ${backgroundGradients[quote.background_color]}
        widget-shadow hover:shadow-lg transition-all duration-300
        transform hover:scale-[1.02]
      `}>
        {/* Quote Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-medium leading-relaxed mb-4">
                "{quote.text}"
              </p>
              <p className="text-sm opacity-90 font-medium">
                — {quote.author}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <motion.div
                animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-5 h-5 ${isLiked ? 'fill-current text-red-300' : ''}`} 
                />
              </motion.div>
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Favorite Indicator */}
        {isLiked && (
          <div className="absolute top-4 right-4">
            <Heart className="w-5 h-5 fill-current text-red-300" />
          </div>
        )}
      </div>
    </motion.div>
  );
}