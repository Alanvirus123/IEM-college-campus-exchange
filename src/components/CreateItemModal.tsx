'use client';

import React, { useState, useRef } from 'react';
import { X, Sparkles, BookOpen, Laptop, Armchair, FlaskConical, MapPin, Camera, Image as ImageIcon, Trash2, Plus, Link as LinkIcon } from 'lucide-react';
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
  const [price, setPrice] = useState<number>(500);
  const [description, setDescription] = useState('');
  const [campusLocation, setCampusLocation] = useState('Central Library Quad');
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [interestedTradeFor, setInterestedTradeFor] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Image upload states: camera, gallery, or URL
  const [images, setImages] = useState<string[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const quickImages: Record<CategoryType, string> = {
    books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    electronics: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    furniture: 'https://images.unsplash.com/photo-1580481077195-c3a82104e382?auto=format&fit=crop&q=80&w=1000',
    lab: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
  };

  // Handle file uploads (both camera and gallery)
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach(file => {
      if (images.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => prev.length < 4 ? [...prev, e.target!.result as string] : prev);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    if (images.length < 4) {
      setImages(prev => [...prev, customUrl.trim()]);
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalImages = images.length > 0 ? images : [quickImages[category]];
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
      images: finalImages,
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
          
          {/* Title */}
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

          {/* Photos Upload: Camera & Gallery */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                Product Pictures ({images.length}/4)
              </label>
              <span className="text-[11px] text-gray-400">Click photo or import from gallery</span>
            </div>

            {/* Hidden file inputs */}
            {/* Camera input with capture="environment" for mobile camera trigger */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {/* Gallery input allowing multi-selection */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={galleryInputRef}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Action buttons for Camera and Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={images.length >= 4}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/70 text-xs font-semibold disabled:opacity-50 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={images.length >= 4}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 hover:bg-gray-100 text-gray-700 dark:text-zinc-200 text-xs font-semibold disabled:opacity-50 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery Import</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 hover:bg-gray-100 text-gray-600 dark:text-zinc-400 text-xs font-medium transition-all"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Link</span>
              </button>
            </div>

            {/* Optional URL input toggle */}
            {showUrlInput && (
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            )}

            {/* Image Preview Strip */}
            {images.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto p-2 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 shrink-0 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/60 text-[9px] text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Add</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 text-center rounded-2xl bg-gray-50/60 dark:bg-zinc-900/60 border border-dashed border-gray-200 dark:border-zinc-800 text-xs text-gray-400">
                No custom photos added yet. Tap <strong>Take Photo</strong> or <strong>Gallery</strong> to attach goods pictures.
              </div>
            )}
          </div>

          {/* Category Selector */}
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

          {/* Exchange Type & Price (in ₹ INR) */}
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
                <option value="Sell">For Sale (₹ INR)</option>
                <option value="Trade">Exchange / Trade</option>
                <option value="Giveaway">Free Giveaway</option>
              </select>
            </div>

            {exchangeType === 'Sell' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                  Price (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
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

          {/* Condition & Course Code */}
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

          {/* Campus Location */}
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

          {/* Description */}
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

          {/* Tags */}
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

          {/* Submit */}
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
