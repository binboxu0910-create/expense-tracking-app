
import { Expense, Category, CategorizationRule, User } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const STORAGE_KEYS = {
  EXPENSES: 'spendwise_expenses',
  CATEGORIES: 'spendwise_categories',
  RULES: 'spendwise_rules',
  USER: 'spendwise_user'
};

export const dataService = {
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  saveExpenses: (expenses: Expense[]) => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },

  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getRules: (): CategorizationRule[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RULES);
    return data ? JSON.parse(data) : [];
  },

  saveRules: (rules: CategorizationRule[]) => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Logic: find matching rule or return null
  matchRule: (merchant: string): string | null => {
    const rules = dataService.getRules();
    const match = rules.find(r => merchant.toLowerCase().includes(r.keyword.toLowerCase()));
    // Fixed: 'r' was not in scope here; using 'match' instead.
    return match ? match.categoryId : null;
  },

  addRule: (keyword: string, categoryId: string) => {
    const rules = dataService.getRules();
    const existingIndex = rules.findIndex(r => r.keyword.toLowerCase() === keyword.toLowerCase());
    
    if (existingIndex > -1) {
      rules[existingIndex].categoryId = categoryId;
    } else {
      rules.push({ id: Math.random().toString(36).substr(2, 9), keyword, categoryId });
    }
    dataService.saveRules(rules);
  }
};
