
import React, { useState } from 'react';
import { CreditCard, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    onLogin({ id: 'user-1', email, name });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-blue-600 text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
            <CreditCard size={40} />
          </div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-blue-100 mt-2">Manage your finances intelligently with SpendWise AI.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            By signing in, you agree to our terms of service.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
