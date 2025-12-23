
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Calendar, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Expense, Category } from '../types';

const Analytics: React.FC = () => {
  const [expenses] = useState<Expense[]>(dataService.getExpenses());
  const [categories] = useState<Category[]>(dataService.getCategories());

  const categoryData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      amount: expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0),
      color: cat.color
    })).filter(d => d.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [expenses, categories]);

  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => {
      const amount = expenses.filter(e => new Date(e.date).getMonth() === idx).reduce((sum, e) => sum + e.amount, 0);
      return { month, amount };
    });
  }, [expenses]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Discover patterns in your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown (Bar) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Spending by Category</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                   formatter={(v: number) => `$${v.toFixed(2)}`}
                />
                <Bar dataKey="amount" radius={[0, 10, 10, 0]}>
                   {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Monthly Evolution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                   formatter={(v: number) => `$${v.toFixed(2)}`}
                />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Method Insights */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-6">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <h4 className="text-blue-700 font-semibold mb-2">Weekend Spender</h4>
            <p className="text-sm text-blue-600/80">You tend to spend 25% more on weekends compared to weekdays. Mostly on Entertainment and Food.</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl">
            <h4 className="text-emerald-700 font-semibold mb-2">Utilities Insight</h4>
            <p className="text-sm text-emerald-600/80">Your utility bills are consistent! Keep up the good work on managing fixed costs.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl">
            <h4 className="text-purple-700 font-semibold mb-2">Subscription Alert</h4>
            <p className="text-sm text-purple-600/80">You have 5 active recurring subscriptions totaling $84.00 per month.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
