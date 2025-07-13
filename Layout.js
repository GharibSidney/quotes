import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Quote, Plus, Heart, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <style>{`
        :root {
          --primary-blue: #007AFF;
          --primary-purple: #AF52DE;
          --text-primary: #1D1D1F;
          --text-secondary: #86868B;
          --surface-white: #FFFFFF;
          --surface-gray: #F2F2F7;
        }
        
        .ios-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .widget-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .button-bounce:active {
          transform: scale(0.95);
        }
      `}</style>
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 ios-blur bg-white/80 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Quotes</h1>
                <p className="text-xs text-gray-500">Inspire & Create</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={createPageUrl("Quotes")}
                className={`p-2 rounded-xl transition-all duration-200 button-bounce ${
                  location.pathname === createPageUrl("Quotes")
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
              </Link>
              <Link
                to={createPageUrl("Favorites")}
                className={`p-2 rounded-xl transition-all duration-200 button-bounce ${
                  location.pathname === createPageUrl("Favorites")
                    ? 'bg-pink-100 text-pink-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}