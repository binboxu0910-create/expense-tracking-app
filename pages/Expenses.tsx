
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Expense, Category } from '../types';
import { ICON_MAP } from '../constants';
import ExpenseForm from '../components/ExpenseForm';

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(dataService.getExpenses());
  const [categories] = useState<Category[]>(dataService.getCategories());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => {
        const matchesSearch = e.merchant.toLowerCase().includes(search.toLowerCase()) || 
                             e.notes?.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filterCategory === 'all' || e.categoryId === filterCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, search, filterCategory]);

  const handleSave = (exp: Partial<Expense>) => {
    if (editingExpense) {
      const updated = expenses.map(e => e.id === editingExpense.id ? { ...e, ...exp } as Expense : e);
      setExpenses(updated);
      dataService.saveExpenses(updated);
    } else {
      const newExp: Expense = {
        ...exp as Expense,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      const updated = [...expenses, newExp];
      setExpenses(updated);
      dataService.saveExpenses(updated);
    }
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      dataService.saveExpenses(updated);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.merchant,
      categories.find(c => c.id === e.categoryId)?.name || 'Unknown',
      e.amount.toString(),
      e.paymentMethod,
      e.notes || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spendwise_expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">View and manage your transaction history.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={exportToCSV}
            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2"
          >
            <Download size={20} />
            <span className="hidden md:inline font-medium">Export</span>
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium"
          >
            <Plus size={20} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search merchant or notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-3 border border-gray-200 rounded-xl">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none text-gray-600"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Receipt</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map(exp => {
                const cat = categories.find(c => c.id === exp.categoryId);
                return (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{exp.merchant}</span>
                        <span className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>
                          {cat && ICON_MAP[cat.icon]}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{cat?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{exp.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">${exp.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {exp.receiptImage ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border cursor-pointer hover:scale-110 transition-transform">
                          <img src={exp.receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-300">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(exp.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full text-gray-300 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No expenses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}

        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredExpenses.length} results</p>
          <div className="flex items-center space-x-2">
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronLeft size={20}/></button>
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronRight size={20}/></button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <ExpenseForm 
          onClose={() => { setIsFormOpen(false); setEditingExpense(undefined); }}
          onSave={handleSave}
          initialData={editingExpense}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Expenses;
