'use client';

import React from 'react';
import { Search, PlusCircle, Bookmark, Sparkles, QrCode, LogIn, User as UserIcon } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { searchTerm, setSearchTerm, savedItemIds, savedOnly, setSavedOnly, setQrModalOpen } = useMarketplace();
  const { currentUser, openAuthModal, setProfileModalOpen } = useAuth();

  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#121316]/80 border-b border-gray-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo / Brand */}
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

        {/* Global Search Bar */}
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

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* QR Code trigger button for mobile scan */}
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors border border-gray-200/60 dark:border-zinc-700"
            title="Scan QR to open on mobile"
          >
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Mobile QR</span>
          </button>

          {/* Saved Items */}
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

          {/* Post Item CTA */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post Item</span>
          </button>

          {/* Auth: Sign In or User Profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-gray-200 dark:border-zinc-800">
            {currentUser ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all"
                title={`Signed in as ${currentUser.name} - View Profile`}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-blue-500/30 object-cover"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentUser.avatarColor || 'from-blue-600 to-indigo-600'} text-white text-xs font-bold flex items-center justify-center shadow-xs`}>
                    {userInitials}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
