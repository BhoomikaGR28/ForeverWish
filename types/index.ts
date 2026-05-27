export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  createdAt: Date;
  wishCount: number;
}

export interface WishProject {
  id: string;
  userId: string;
  recipientName: string;
  senderName: string;
  message: string;
  theme: WishTheme;
  category: WishCategory;
  photos: MediaItem[];
  videos: MediaItem[];
  voiceNotes: MediaItem[];
  backgroundMusic: string | null;
  countdownDate: string | null;
  timeline: TimelineItem[];
  customFont: string;
  primaryColor: string;
  isPublic: boolean;
  isPasswordProtected: boolean;
  password?: string;
  isPremium: boolean;
  slug: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  type: 'photo' | 'video' | 'voice';
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  photoUrl?: string;
}

export type WishTheme =
  | 'rose-garden'
  | 'midnight-magic'
  | 'golden-hour'
  | 'ocean-dream'
  | 'lavender-mist'
  | 'cherry-blossom'
  | 'starry-night'
  | 'tropical-paradise';

export type WishCategory =
  | 'birthday'
  | 'anniversary'
  | 'best-friend'
  | 'couple'
  | 'farewell'
  | 'friendship'
  | 'proposal'
  | 'memory-collection';

export interface Theme {
  id: WishTheme;
  name: string;
  gradient: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  emoji: string;
  isPremium: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  isPremium: boolean;
}

export interface AIWishStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Analytics {
  projectId: string;
  views: number;
  shares: number;
  uniqueVisitors: number;
  topCountries: { country: string; count: number }[];
  viewsByDay: { date: string; count: number }[];
}
