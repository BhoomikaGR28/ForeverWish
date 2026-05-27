import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { THEMES } from './constants';
import { WishTheme } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTheme(id: WishTheme) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getCountdown(targetDate: string | null): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  if (!targetDate) return null;
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function getShareUrl(slug: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || 'https://foreverwish.vercel.app';
  return `${base}/wish/${slug}`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const WHATSAPP_SHARE = (url: string, name: string) =>
  `https://wa.me/?text=Hey!+I+made+you+something+special+🎁+Open+this+surprise+from+the+heart+✨+${encodeURIComponent(url)}`;

export const INSTAGRAM_CAPTION = (name: string) =>
  `Made a special surprise for ${name} on ForeverWish 💕 foreverwish.app`;
