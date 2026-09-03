'use client';

import React from 'react';
import { Search, PlusCircle, Bookmark, Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { searchTerm, setSearchTerm, savedItemIds, savedOnly, setSavedOnly } = useMarketplace();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#121316]/80 border-b border-gray-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white/90" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-gray-900 dark:text-white">
              <span>UniLoop</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                Campus Exchange
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search textbooks, microscopes, monitors, dorm chairs, course codes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/90 dark:bg-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 rounded-full border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`relative p-2 rounded-full transition-colors ${
              savedOnly
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
            title="Saved items"
          >
            <Bookmark className="w-5 h-5" />
            {savedItemIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedItemIds.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post Item</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
              alt="Alex"
              className="w-8 h-8 rounded-full border border-blue-500/30 object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
