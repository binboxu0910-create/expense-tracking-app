
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Tag, Zap } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Category, CategorizationRule } from '../types';

const SettingsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(dataService.getCategories());
  const [rules, setRules] = useState<CategorizationRule[]>(dataService.getRules());

  const handleAddCategory = () => {
    const name = window.prompt('Enter category name:');
    if (!name) return;
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      icon: 'MoreHorizontal',
      isCustom: true
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    dataService.saveCategories(updated);
  };

  const handleDeleteRule = (id: string) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    dataService.saveRules(updated);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Customize categories and automation rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Management */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg flex items-center">
              <Tag size={20} className="mr-2 text-blue-600" />
              Categories
            </h3>
            <button 
              onClick={handleAddCategory}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center space-x-3 p-3 border rounded-xl bg-gray-50/30">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Rules Management */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center">
            <Zap size={20} className="mr-2 text-orange-500" />
            Auto-Categorization Rules
          </h3>
          <div className="space-y-3">
            {rules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No rules defined yet. Rules are created automatically when you categorize merchants.</p>
            ) : (
              rules.map(rule => {
                const cat = categories.find(c => c.id === rule.categoryId);
                return (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">If contains "{rule.keyword}"</span>
                      <span className="text-xs text-gray-500">Assign to {cat?.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Export & Data</h3>
        <p className="text-gray-500 text-sm mb-6">Download all your transaction data in JSON format for backup.</p>
        <button 
          onClick={() => {
            const data = { expenses: dataService.getExpenses(), categories: dataService.getCategories(), rules: dataService.getRules() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'spendwise_backup.json';
            a.click();
          }}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Download Backup (JSON)
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
