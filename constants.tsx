
import React from 'react';
import { 
  Utensils, 
  Film, 
  ShoppingBag, 
  Car, 
  Home, 
  Zap, 
  HeartPulse, 
  BookOpen, 
  Plane, 
  Repeat, 
  MoreHorizontal 
} from 'lucide-react';
import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Food & Drinks', color: '#EF4444', icon: 'Utensils' },
  { id: 'cat-ent', name: 'Entertainment', color: '#8B5CF6', icon: 'Film' },
  { id: 'cat-shop', name: 'Shopping', color: '#EC4899', icon: 'ShoppingBag' },
  { id: 'cat-trans', name: 'Transportation', color: '#F59E0B', icon: 'Car' },
  { id: 'cat-housing', name: 'Housing', color: '#3B82F6', icon: 'Home' },
  { id: 'cat-utils', name: 'Utilities', color: '#10B981', icon: 'Zap' },
  { id: 'cat-health', name: 'Health', color: '#EF4444', icon: 'HeartPulse' },
  { id: 'cat-edu', name: 'Education', color: '#6366F1', icon: 'BookOpen' },
  { id: 'cat-travel', name: 'Travel', color: '#06B6D4', icon: 'Plane' },
  { id: 'cat-subs', name: 'Subscriptions', color: '#6B7280', icon: 'Repeat' },
  { id: 'cat-other', name: 'Other', color: '#9CA3AF', icon: 'MoreHorizontal' },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils size={18} />,
  Film: <Film size={18} />,
  ShoppingBag: <ShoppingBag size={18} />,
  Car: <Car size={18} />,
  Home: <Home size={18} />,
  Zap: <Zap size={18} />,
  HeartPulse: <HeartPulse size={18} />,
  BookOpen: <BookOpen size={18} />,
  Plane: <Plane size={18} />,
  Repeat: <Repeat size={18} />,
  MoreHorizontal: <MoreHorizontal size={18} />,
};

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Digital Wallet'
];
