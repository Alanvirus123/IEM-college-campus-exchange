export type CategoryType = 'books' | 'electronics' | 'furniture' | 'lab';

export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type ExchangeType = 'Trade' | 'Sell' | 'Giveaway' | 'Borrow';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  major?: string;
  year?: string;
  avatar?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface SellerInfo {
  id: string;
  name: string;
  avatar: string;
  major: string;
  year: string;
  rating: number;
  tradesCompleted: number;
  verifiedStudent: boolean;
  email?: string;
  phone?: string;
  alternatePhone?: string;
}

export interface ListingItem {
  id: string;
  title: string;
  category: CategoryType;
  price: number;
  exchangeType: ExchangeType;
  condition: ItemCondition;
  description: string;
  campusLocation: string;
  department?: string;
  courseCode?: string;
  images: string[];
  seller: SellerInfo;
  postedDate: string;
  isAvailable: boolean;
  interestedTradeFor?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  tradeItemTitle?: string;
  status?: 'pending' | 'accepted' | 'declined';
}
