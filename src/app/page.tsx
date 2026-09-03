'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, DollarSign, PackageSearch } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CategoryBar } from '@/components/CategoryBar';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { CreateItemModal } from '@/components/CreateItemModal';
import { useMarketplace } from '@/context/MarketplaceContext';

export default function Home() {
  const {
    items,
    activeItem,
    setActiveItem,
    searchTerm,
    selectedCategory,
    selectedExchangeType,
    savedOnly,
    savedItemIds
  } = useMarketplace();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    if (savedOnly && !savedItemIds.includes(item.id)) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedExchangeType !== 'all' && item.exchangeType !== selectedExchangeType) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.campusLocation.toLowerCase().includes(q);
      const matchCourse = item.courseCode ? item.courseCode.toLowerCase().includes(q) : false;
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchCourse && !matchTags) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f1013] text-gray-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      <Navbar onOpenCreateModal={() => setCreateModalOpen(true)} />

      <section className="relative overflow-hidden border-b border-gray-100 dark:border-zinc-800/80 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-zinc-900/40 dark:via-[#0f1013] dark:to-transparent py-10 sm:py-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-violet-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Peer-to-Peer Student Circular Economy</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                Exchange Campus Gear. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
                  Don't Buy Brand New.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
                Connect with students across dorms & departments to buy, trade, or giveaway textbooks, lab gear, monitors, and furniture. Save up to 80% on college essentials.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Post Listing for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Campus Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <span>Zero Waste</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span>Zero Fees</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-sm">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-xs">
                <div className="text-2xl font-black text-gray-900 dark:text-white">$42,800+</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Saved by students</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-xs">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">1,240+</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Books & items reused</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-xs">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">On-campus meetups</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-xs">
                <div className="text-2xl font-black text-violet-600 dark:text-violet-400">4.9 ★</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Peer trade rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {savedOnly ? 'Your Saved Watchlist' : 'Available on Campus'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">No items found</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Try adjusting your search keywords or switching categories to see other items available on campus.
            </p>
          </div>
        )}
      </main>

      {activeItem && (
        <ItemDetailModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}

      {createModalOpen && (
        <CreateItemModal
          onClose={() => setCreateModalOpen(false)}
        />
      )}

      <footer className="border-t border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-[#121316] py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">UniLoop Campus Exchange</span>
            <span>• Built for university sustainability and affordable education</span>
          </div>
          <div>
            Designed with Google Stitch UI Guidelines
          </div>
        </div>
      </footer>
    </div>
  );
}
