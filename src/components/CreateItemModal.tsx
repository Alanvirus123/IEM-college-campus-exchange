'use client';

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Laptop, Armchair, FlaskConical, MapPin } from 'lucide-react';
import { CategoryType, ItemCondition, ExchangeType } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';

interface CreateItemModalProps {
  onClose: () => void;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({ onClose }) => {
  const { addItem } = useMarketplace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('books');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('Sell');
  const [price, setPrice] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [campusLocation, setCampusLocation] = useState('Central Library Quad');
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [interestedTradeFor, setInterestedTradeFor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const quickImages: Record<CategoryType, string> = {
    books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    electronics: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    furniture: 'https://images.unsplash.com/photo-1580481077195-c3a82104e382?auto=format&fit=crop&q=80&w=1000',
    lab: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalImage = imageUrl.trim() || quickImages[category];
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addItem({
      title,
      category,
      condition,
      exchangeType,
      price: exchangeType === 'Sell' ? price : 0,
      description,
      campusLocation,
      department: department || undefined,
      courseCode: courseCode || undefined,
      interestedTradeFor: exchangeType === 'Trade' ? interestedTradeFor : undefined,
      images: [finalImage],
      tags: tags.length > 0 ? tags : [category, condition]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#18191e] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                List an Item for Campus Exchange
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Help fellow students save money on textbooks, electronics, dorm gear & lab kits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry 8th Edition, TI-84 Plus, or Dorm Desk"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'books', name: 'Textbooks', icon: BookOpen },
                { id: 'electronics', name: 'Electronics', icon: Laptop },
                { id: 'furniture', name: 'Furniture', icon: Armchair },
                { id: 'lab', name: 'Lab Gear', icon: FlaskConical },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as CategoryType)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                Exchange Type
              </label>
              <select
                value={exchangeType}
                onChange={(e) => setExchangeType(e.target.value as ExchangeType)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="Sell">For Sale (Cash/Venmo)</option>
                <option value="Trade">Exchange / Trade</option>
                <option value="Giveaway">Free Giveaway</option>
              </select>
            </div>

            {exchangeType === 'Sell' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            ) : exchangeType === 'Trade' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                  Looking to trade for
                </label>
                <input
                  type="text"
                  value={interestedTradeFor}
                  onChange={(e) => setInterestedTradeFor(e.target.value)}
                  placeholder="e.g. iPad pencil, desk lamp, or calculus book"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            ) : (
              <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 self-center pt-5">
                🎉 Will be marked as a Free Campus Giveaway!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="Brand New">Brand New (Unused)</option>
                <option value="Like New">Like New (Barely used)</option>
                <option value="Good">Good (Minor wear)</option>
                <option value="Fair">Fair (Well used but functional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS106, CHEM101, PHYS20"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Pickup Spot / Residence Hall
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                placeholder="e.g. West Campus Commons, Engineering Quad, or Library Lobby"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Photo URL (Optional, defaults to verified campus placeholder)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention edition, highlighting, accessories included, or reason for selling..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Dorm, Textbook, Pre-med, Monitor, Moving"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              Publish Campus Listing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
