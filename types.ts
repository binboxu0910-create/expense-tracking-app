
export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  isCustom?: boolean;
};

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Digital Wallet';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  merchant: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptImage?: string;
  createdAt: number;
}

export interface CategorizationRule {
  id: string;
  keyword: string;
  categoryId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DashboardStats {
  totalSpend: number;
  avgDaily: number;
  topCategory: string;
  biggestTransaction: number;
}
