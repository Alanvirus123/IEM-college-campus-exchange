'use client';

import React, { useState } from 'react';
import { X, Mail, Phone, LogOut, CheckCircle, Edit3, ShieldCheck, User, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserProfileModal: React.FC = () => {
  const { currentUser, profileModalOpen, setProfileModalOpen, signOut, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [major, setMajor] = useState(currentUser?.major || '');

  if (!profileModalOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      major
    });
    setIsEditing(false);
  };

  const initials = currentUser.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white dark:bg-[#18191e] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-gray-100 dark:border-zinc-800">
          <div className="relative inline-block mb-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md mx-auto"
              />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${currentUser.avatarColor || 'from-blue-600 to-indigo-600'} text-white font-bold text-2xl flex items-center justify-center shadow-md mx-auto`}>
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 p-1 rounded-full bg-blue-600 text-white shadow-xs">
              <CheckCircle className="w-4 h-4 fill-white text-blue-600" />
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
            <span>{currentUser.name}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            {currentUser.major} • {currentUser.year}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SMS Phone Verified</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400 uppercase">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400 uppercase">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800 border rounded-lg"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-left overflow-hidden">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Contact Email</div>
                    <div className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">{currentUser.email}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="text-left overflow-hidden">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Mobile / WhatsApp</div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">{currentUser.phone}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
