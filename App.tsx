
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  Plus, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  History
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import { dataService } from './services/dataService';
import { User } from './types';

const Navigation: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/expenses', label: 'Expenses', icon: <History size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile Nav Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <CreditCard size={20} />
          </div>
          <span className="font-bold text-xl text-gray-800">SpendWise</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar / Mobile Menu */}
      <aside className={`
        fixed lg:static inset-0 bg-white border-r z-40 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 flex flex-col h-full
      `}>
        <div className="hidden lg:flex items-center space-x-2 p-6">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <CreditCard size={24} />
          </div>
          <span className="font-bold text-2xl text-gray-800">SpendWise</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(dataService.getCurrentUser());

  const handleLogin = (u: User) => {
    dataService.setUser(u);
    setUser(u);
  };

  const handleLogout = () => {
    dataService.setUser(null);
    setUser(null);
  };

  return (
    <HashRouter>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 overflow-hidden">
        {user && <Navigation user={user} onLogout={handleLogout} />}
        
        <main className="flex-1 overflow-y-auto h-screen relative">
          <Routes>
            {!user ? (
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<SettingsPage />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
