
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Plus, Filter, Download, ArrowUpRight } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Expense, Category, DashboardStats } from '../types';
import SummaryCards from '../components/SummaryCards';
import ExpenseForm from '../components/ExpenseForm';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(dataService.getExpenses());
  const [categories, setCategories] = useState<Category[]>(dataService.getCategories());
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = useMemo((): DashboardStats => {
    if (expenses.length === 0) return { totalSpend: 0, avgDaily: 0, topCategory: 'N/A', biggestTransaction: 0 };
    
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const biggest = Math.max(...expenses.map(e => e.amount));
    
    const catCounts = expenses.reduce((acc, e) => {
      acc[e.categoryId] = (acc[e.categoryId] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Fixed: Cast Object.entries to a strictly typed array to fix subtraction type error.
    const topCatId = (Object.entries(catCounts) as [string, number][]).sort((a, b) => b[1] - a[1])[0][0];
    const topCatName = categories.find(c => c.id === topCatId)?.name || 'Other';
    
    const dates = new Set(expenses.map(e => e.date));
    const avg = total / Math.max(dates.size, 1);

    return { totalSpend: total, avgDaily: avg, topCategory: topCatName, biggestTransaction: biggest };
  }, [expenses, categories]);

  const chartData = useMemo(() => {
    // Last 7 days trend
    const dailyData: Record<string, number> = {};
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      dailyData[date] = expenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);
    });

    return Object.entries(dailyData).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
      amount
    }));
  }, [expenses]);

  const categoryPieData = useMemo(() => {
    const data = categories.map(cat => ({
      name: cat.name,
      value: expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0),
      color: cat.color
    })).filter(d => d.value > 0);
    return data;
  }, [expenses, categories]);

  const handleAddExpense = (newExp: Partial<Expense>) => {
    const fullExp: Expense = {
      ...newExp as Expense,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    const updated = [...expenses, fullExp];
    setExpenses(updated);
    dataService.saveExpenses(updated);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Here's your spending summary for this month.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium active:scale-95"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <SummaryCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Spending Trend (Last 7 Days)</h3>
            <span className="text-sm text-blue-600 font-medium cursor-pointer flex items-center">
              Full Analytics <ArrowUpRight size={16} className="ml-1" />
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6">By Category</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400">
                No data available
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {categoryPieData.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
                <span className="text-sm font-bold">${cat.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Mini List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Recent Expenses</h3>
          <button className="text-sm text-blue-600 font-medium">View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {expenses.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map(exp => {
            const cat = categories.find(c => c.id === exp.categoryId);
            return (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>
                    <Plus size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{exp.merchant}</p>
                    <p className="text-xs text-gray-500">{cat?.name} • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">-${exp.amount.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showAddForm && (
        <ExpenseForm 
          onClose={() => setShowAddForm(false)} 
          onSave={handleAddExpense}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Dashboard;
