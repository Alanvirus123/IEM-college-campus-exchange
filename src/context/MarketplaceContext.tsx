'use client';

import React, { createContext, useContext, useState } from 'react';
import { ListingItem, ChatMessage } from '../types';
import { INITIAL_ITEMS } from '../data/mockData';

interface MarketplaceContextType {
  items: ListingItem[];
  savedItemIds: string[];
  toggleSaveItem: (id: string) => void;
  addItem: (item: Omit<ListingItem, 'id' | 'postedDate' | 'isAvailable' | 'seller'>) => void;
  activeItem: ListingItem | null;
  setActiveItem: (item: ListingItem | null) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (itemId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  acceptOffer: (itemId: string, messageId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedExchangeType: string;
  setSelectedExchangeType: (type: string) => void;
  savedOnly: boolean;
  setSavedOnly: (saved: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ListingItem[]>(INITIAL_ITEMS);
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['item-1', 'item-4']);
  const [activeItem, setActiveItem] = useState<ListingItem | null>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExchangeType, setSelectedExchangeType] = useState<string>('all');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'item-1': [
      {
        id: 'msg-1',
        senderId: 'seller-1',
        text: 'Hi there! The Campbell Bio book is available. Which residence hall are you at?',
        timestamp: '11:42 AM'
      },
      {
        id: 'msg-2',
        senderId: 'me',
        text: 'Hey! I am at North Quad. Could you do $30 cash or trade for Wade Orgo?',
        timestamp: '11:45 AM',
        isOffer: true,
        offerAmount: 30,
        status: 'pending'
      }
    ]
  });

  const toggleSaveItem = (id: string) => {
    setSavedItemIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const addItem = (newItemData: Omit<ListingItem, 'id' | 'postedDate' | 'isAvailable' | 'seller'>) => {
    const newItem: ListingItem = {
      ...newItemData,
      id: 'item-' + (items.length + 1) + '-' + Date.now(),
      postedDate: 'Just now',
      isAvailable: true,
      seller: {
        id: 'me',
        name: 'Alex Vance (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        major: 'Engineering & Computing',
        year: 'Junior (3rd Year)',
        rating: 5.0,
        tradesCompleted: 4,
        verifiedStudent: true
      }
    };
    setItems(prev => [newItem, ...prev]);
  };

  const sendMessage = (itemId: string, text: string, isOffer = false, offerAmount?: number) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOffer,
      offerAmount,
      status: isOffer ? 'pending' : undefined
    };

    setMessages(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newMsg]
    }));
  };

  const acceptOffer = (itemId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).map(m => 
        m.id === messageId ? { ...m, status: 'accepted' } : m
      )
    }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        items,
        savedItemIds,
        toggleSaveItem,
        addItem,
        activeItem,
        setActiveItem,
        chatOpen,
        setChatOpen,
        messages,
        sendMessage,
        acceptOffer,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedExchangeType,
        setSelectedExchangeType,
        savedOnly,
        setSavedOnly
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return context;
};
