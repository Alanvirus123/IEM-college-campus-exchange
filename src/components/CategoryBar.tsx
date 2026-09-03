'use client';

import React from 'react';
import { BookOpen, Laptop, Armchair, FlaskConical, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useMarketplace } from '../context/MarketplaceContext';

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory, selectedExchangeType, setSelectedExchangeType } = useMarketplace();

  const getIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Armchair': return <Armchair className="w-4 h-4" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const exchangeFilters = ['all', 'Sell', 'Trade', 'Giveaway'];

  return (
    <div className="py-4 border-b border-gray-100 dark:border-zinc-800/80 bg-white/50 dark:bg-[#121316]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'bg-gray-100 dark:bg-zinc-800/70 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {getIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto bg-gray-100 dark:bg-zinc-900 p-1 rounded-full border border-gray-200/60 dark:border-zinc-800">
          {exchangeFilters.map((type) => {
            const isActive = selectedExchangeType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedExchangeType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
