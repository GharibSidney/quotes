
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quote } from "@/entities/Quote";

const categories = [
  { value: "inspiration", label: "Inspiration" },
  { value: "motivation", label: "Motivation" },
  { value: "love", label: "Love" },
  { value: "wisdom", label: "Wisdom" },
  { value: "success", label: "Success" },
  { value: "life", label: "Life" },
  { value: "happiness", label: "Happiness" },
  { value: "friendship", label: "Friendship" }
];

const colorOptions = [
  { value: "blue", label: "Ocean Blue", class: "from-blue-400 to-blue-600" },
  { value: "purple", label: "Royal Purple", class: "from-purple-400 to-purple-600" },
  { value: "green", label: "Nature Green", class: "from-green-400 to-green-600" },
  { value: "orange", label: "Sunset Orange", class: "from-orange-400 to-orange-600" },
  { value: "pink", label: "Rose Pink", class: "from-pink-400 to-pink-600" },
  { value: "teal", label: "Ocean Teal", class: "from-teal-400 to-teal-600" }
];

export default function CreateQuoteModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    category: "inspiration",
    background_color: "blue",
    is_favorite: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.author.trim()) return;

    setIsSubmitting(true);
    try {
      await Quote.create(formData);
      setFormData({
        text: "",
        author: "",
        category: "inspiration", 
        background_color: "blue",
        is_favorite: false
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error creating quote:", error);
    }
    setIsSubmitting(false);
  };

  const selectedColor = colorOptions.find(c => c.value === formData.background_color);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 ios-blur"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl widget-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Create Quote</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quote Text</label>
                <Textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Enter your inspiring quote..."
                  className="resize-none h-24 rounded-xl border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Who said this?"
                  className="rounded-xl border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color Theme</label>
                  <Select
                    value={formData.background_color}
                    onValueChange={(value) => setFormData({ ...formData, background_color: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                          Ocean Blue
                        </div>
                      </SelectItem>
                      <SelectItem value="purple">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                          Royal Purple
                        </div>
                      </SelectItem>
                      <SelectItem value="green">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600" />
                          Nature Green
                        </div>
                      </SelectItem>
                      <SelectItem value="orange">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
                          Sunset Orange
                        </div>
                      </SelectItem>
                      <SelectItem value="pink">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-600" />
                          Rose Pink
                        </div>
                      </SelectItem>
                      <SelectItem value="teal">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-teal-600" />
                          Ocean Teal
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preview</label>
                <div className={`
                  relative h-32 rounded-2xl overflow-hidden
                  bg-gradient-to-br ${
                    formData.background_color === "blue" ? "from-blue-400 to-blue-600" :
                    formData.background_color === "purple" ? "from-purple-400 to-purple-600" :
                    formData.background_color === "green" ? "from-green-400 to-green-600" :
                    formData.background_color === "orange" ? "from-orange-400 to-orange-600" :
                    formData.background_color === "pink" ? "from-pink-400 to-pink-600" :
                    "from-teal-400 to-teal-600"
                  }
                  flex items-center justify-center p-4
                `}>
                  <div className="text-center text-white">
                    <p className="text-sm font-medium mb-1">
                      "{formData.text || 'Your quote here...'}"
                    </p>
                    <p className="text-xs opacity-90">
                      — {formData.author || 'Author'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.text.trim() || !formData.author.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white button-bounce"
                >
                  {isSubmitting ? "Creating..." : "Create Quote"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
