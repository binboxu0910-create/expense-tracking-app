
import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Sparkles, Loader2 } from 'lucide-react';
import { Expense, Category, PaymentMethod } from '../types';
import { dataService } from '../services/dataService';
import { smartCategorize } from '../services/geminiService';
import { PAYMENT_METHODS } from '../constants';

interface ExpenseFormProps {
  onClose: () => void;
  onSave: (expense: Partial<Expense>) => void;
  initialData?: Expense;
  categories: Category[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSave, initialData, categories }) => {
  const [formData, setFormData] = useState<Partial<Expense>>(
    initialData || {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      categoryId: 'cat-other',
      merchant: '',
      paymentMethod: 'Debit Card',
      notes: '',
    }
  );
  const [isSmartLoading, setIsSmartLoading] = useState(false);

  const handleMerchantBlur = async () => {
    if (!formData.merchant || (initialData && formData.merchant === initialData.merchant)) return;
    
    // Check local rules first
    const matchedCategory = dataService.matchRule(formData.merchant);
    if (matchedCategory) {
      setFormData(prev => ({ ...prev, categoryId: matchedCategory }));
      return;
    }

    // Try Gemini smart categorization
    setIsSmartLoading(true);
    const aiCategory = await smartCategorize(formData.merchant);
    if (aiCategory) {
      setFormData(prev => ({ ...prev, categoryId: aiCategory }));
    }
    setIsSmartLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.merchant) return;
    
    // Auto-create rule if user overrides category
    if (initialData && formData.categoryId !== initialData.categoryId) {
        dataService.addRule(formData.merchant, formData.categoryId!);
    } else if (!initialData && formData.merchant && formData.categoryId) {
         // Optionally suggest adding a rule for new expenses too
         dataService.addRule(formData.merchant, formData.categoryId);
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Merchant / Payee</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.merchant}
                onBlur={handleMerchantBlur}
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pr-10"
                placeholder="e.g. Starbucks, Amazon"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSmartLoading ? (
                  <Loader2 className="animate-spin text-blue-500" size={18} />
                ) : (
                  <Sparkles className="text-gray-300" size={18} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none h-20"
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-xs text-gray-500">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </label>
              {formData.receiptImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border">
                  <img src={formData.receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            {initialData ? 'Update Expense' : 'Create Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
