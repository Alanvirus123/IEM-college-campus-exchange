'use client';

import React, { useState } from 'react';
import { X, MapPin, CheckCircle, Repeat, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { ListingItem } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatRupee } from '../lib/formatCurrency';

interface ItemDetailModalProps {
  item: ListingItem;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { messages, sendMessage, savedItemIds, toggleSaveItem } = useMarketplace();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [offerValue, setOfferValue] = useState<number>(item.price > 0 ? item.price : 0);
  const [showOfferForm, setShowOfferForm] = useState(false);

  const itemMessages = messages[item.id] || [];
  const isSaved = savedItemIds.includes(item.id);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(item.id, chatInput.trim());
    setChatInput('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(
      item.id,
      `I would like to make an offer of ${formatRupee(offerValue)} for this item. Can meet at ${item.campusLocation}!`,
      true,
      offerValue
    );
    setShowOfferForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#18191e] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-zinc-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200/70 dark:border-zinc-800">
          <div className="space-y-4">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-zinc-900 shadow-inner">
              <img
                src={item.images[activeImgIdx] || item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
                {item.condition}
              </span>
            </div>

            {item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImgIdx === i ? 'border-blue-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-xs text-blue-900 dark:text-blue-300 leading-tight">
              <span className="font-semibold">Verified Campus Exchange:</span> Only registered students with institutional emails can negotiate trades.
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[90vh]">
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <span>{item.category}</span>
                {item.courseCode && <span>• {item.courseCode}</span>}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                {item.title}
              </h2>
              <div className="flex items-baseline gap-3 mt-2">
                {item.price > 0 ? (
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{formatRupee(item.price)}</span>
                ) : (
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {item.exchangeType === 'Giveaway' ? 'Free Giveaway' : 'Trade Available'}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
                  Posted {item.postedDate}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/70 border border-gray-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900 dark:text-zinc-100">
                    <span>{item.seller.name}</span>
                    <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-blue-950" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {item.seller.major} • {item.seller.year}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <span>★ {item.seller.rating.toFixed(1)}</span>
                    <span className="text-gray-400">•</span>
                    <span>{item.seller.tradesCompleted} campus trades</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                Campus Meetup Point
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-zinc-200 font-medium">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{item.campusLocation}</span>
              </div>
            </div>

            {item.interestedTradeFor && (
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 mb-0.5">
                  <Repeat className="w-3.5 h-3.5" /> Seller wishes to trade for:
                </div>
                <p className="text-xs text-violet-900 dark:text-violet-200 font-medium">
                  {item.interestedTradeFor}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                Item Details
              </h4>
              <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Live Campus Chat & Offers
                </h4>
                <span className="text-[11px] text-gray-400">Direct student message</span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto p-3 rounded-2xl bg-gray-50/70 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                {itemMessages.length === 0 ? (
                  <p className="text-xs text-center text-gray-400 py-4">
                    No messages yet. Send a question or offer below to arrange pickup!
                  </p>
                ) : (
                  itemMessages.map((msg) => {
                    const isMe = msg.senderId === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs font-medium ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-tr-xs'
                              : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 rounded-tl-xs shadow-xs'
                          }`}
                        >
                          {msg.isOffer && (
                            <div className="mb-1 pb-1 border-b border-white/20 font-bold flex items-center justify-between gap-2">
                              <span>Offer: {formatRupee(msg.offerAmount || 0)}</span>
                              <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                                {msg.status || 'Pending'}
                              </span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {showOfferForm ? (
                <form onSubmit={handleSendOffer} className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Submit an Offer</span>
                    <button type="button" onClick={() => setShowOfferForm(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">₹</span>
                    <input
                      type="number"
                      value={offerValue}
                      onChange={(e) => setOfferValue(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 rounded-xl border border-gray-300 dark:border-zinc-700 focus:outline-blue-500"
                    />
                    <button
                      type="submit"
                      className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Send Offer to {item.seller.name.split(' ')[0]}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferForm(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    Make Offer (₹)
                  </button>
                </div>
              )}

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question or propose meetup spot..."
                  className="flex-1 px-4 py-2 text-xs bg-gray-100 dark:bg-zinc-800 rounded-full border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-3">
            <button
              onClick={() => toggleSaveItem(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                isSaved
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isSaved ? 'Saved to Watchlist' : 'Save for Later'}
            </button>

            <button
              onClick={() => {
                setShowOfferForm(true);
              }}
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              Exchange / Buy Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
