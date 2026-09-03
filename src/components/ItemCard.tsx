'use client';

import React from 'react';
import { Bookmark, MapPin, Repeat, CheckCircle, Gift } from 'lucide-react';
import { ListingItem } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatRupee } from '../lib/formatCurrency';

interface ItemCardProps {
  item: ListingItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { savedItemIds, toggleSaveItem, setActiveItem } = useMarketplace();
  const isSaved = savedItemIds.includes(item.id);

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Brand New': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'Like New': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'Good': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      default: return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    }
  };

  const getExchangeBadge = () => {
    if (item.exchangeType === 'Giveaway') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-xs">
          <Gift className="w-3 h-3" /> Free Giveaway
        </span>
      );
    }
    if (item.exchangeType === 'Trade') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-xs">
          <Repeat className="w-3 h-3" /> Campus Trade
        </span>
      );
    }
    return (
      <span className="inline-flex items-center font-bold text-gray-900 dark:text-white text-base">
        {formatRupee(item.price)}
      </span>
    );
  };

  return (
    <div 
      onClick={() => setActiveItem(item)}
      className="group cursor-pointer rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/70 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveItem(item.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {item.courseCode && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-900/80 text-zinc-100 backdrop-blur-sm border border-white/10">
              {item.courseCode}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{item.campusLocation}</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {getExchangeBadge()}
          </div>

          <div className="flex items-center gap-1.5">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium truncate max-w-[80px]">
              {item.seller.name.split(' ')[0]}
            </span>
            {item.seller.verifiedStudent && (
              <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-100 dark:fill-blue-950" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
