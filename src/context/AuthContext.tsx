'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  signUp: (data: { name: string; email: string; phone: string; password?: string; major?: string; year?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (data: { emailOrPhone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COLOR_PALETTE = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-600 to-red-600',
  'from-cyan-600 to-blue-600'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('uniloop_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Provide a default logged-in campus student so app is immediately usable
        const defaultUser: User = {
          id: 'user-me-1',
          name: 'Alex Vance',
          email: 'alex.vance@campus.edu',
          phone: '+91 98765 43210',
          major: 'Computer Science & AI',
          year: 'Junior (3rd Year)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          avatarColor: 'from-blue-600 to-indigo-600',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(defaultUser);
        localStorage.setItem('uniloop_current_user', JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Failed to access localStorage', e);
    }
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const signUp = async (data: { name: string; email: string; phone: string; password?: string; major?: string; year?: string }) => {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) {
      return { success: false, error: 'Name, email, and phone number are required.' };
    }

    // Format phone with +91 if not present
    let formattedPhone = data.phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.startsWith('91') ? '+' + formattedPhone : '+91 ' + formattedPhone;
    }

    const randomColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: formattedPhone,
      major: data.major?.trim() || 'General Studies',
      year: data.year?.trim() || 'Undergraduate',
      avatarColor: randomColor,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to registered users list
      const existingUsersRaw = localStorage.getItem('uniloop_registered_users');
      const registered = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      registered.push(newUser);
      localStorage.setItem('uniloop_registered_users', JSON.stringify(registered));

      // Set as current session
      setCurrentUser(newUser);
      localStorage.setItem('uniloop_current_user', JSON.stringify(newUser));
      setAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Could not save user profile.' };
    }
  };

  const signIn = async (data: { emailOrPhone: string; password?: string }) => {
    const q = data.emailOrPhone.trim().toLowerCase();
    if (!q) return { success: false, error: 'Please enter your email or phone number.' };

    try {
      const existingUsersRaw = localStorage.getItem('uniloop_registered_users');
      const registered: User[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      
      const found = registered.find(u => 
        u.email.toLowerCase() === q || 
        u.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
      );

      if (found) {
        setCurrentUser(found);
        localStorage.setItem('uniloop_current_user', JSON.stringify(found));
        setAuthModalOpen(false);
        return { success: true };
      } else {
        // For smooth demo experience, allow instant sign-in with quick profile creation
        const randomColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        const isEmail = q.includes('@');
        const fallbackUser: User = {
          id: 'user-' + Date.now(),
          name: isEmail ? q.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Campus Student',
          email: isEmail ? q : q + '@campus.edu',
          phone: !isEmail ? (q.startsWith('+') ? q : '+91 ' + q) : '+91 98765 00000',
          major: 'Campus Exchange Member',
          year: 'Student',
          avatarColor: randomColor,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);
        localStorage.setItem('uniloop_current_user', JSON.stringify(fallbackUser));
        setAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: 'Sign in failed.' };
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('uniloop_current_user');
    } catch (e) {}
    setProfileModalOpen(false);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      localStorage.setItem('uniloop_current_user', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        profileModalOpen,
        setProfileModalOpen,
        signUp,
        signIn,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
