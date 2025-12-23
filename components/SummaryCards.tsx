
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Layout } from 'lucide-react';
import { DashboardStats } from '../types';

interface SummaryCardsProps {
  stats: DashboardStats;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Spend',
      value: `$${stats.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Avg. Daily Spend',
      value: `$${stats.avgDaily.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <TrendingUp className="text-emerald-600" />,
      color: 'bg-emerald-50',
    },
    {
      label: 'Top Category',
      value: stats.topCategory,
      icon: <Layout className="text-purple-600" />,
      color: 'bg-purple-50',
    },
    {
      label: 'Biggest Transaction',
      value: `$${stats.biggestTransaction.toLocaleString()}`,
      icon: <TrendingDown className="text-orange-600" />,
      color: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
