"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Eye,
  LogOut,
  Clock,
  Bell,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3, href: '/dashboard' },
  { id: 'predictions', label: 'AI Predictions', icon: TrendingUp, href: '/dashboard/ai-predictions' },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet, href: '/dashboard/portfolio' },
  { id: 'watchlist', label: 'Watchlist', icon: Eye, href: '#' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 288 }}
        className={`h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-50 overflow-hidden flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-72'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'px-3 py-4 flex justify-center' : 'px-6 py-[14px]'} border-b border-slate-200 dark:border-slate-700`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">MarketPredictor</h1>
                <p className="text-xs text-slate-500">AI-Powered Insights</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = !!pathname && (pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href)));
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.href)}
                    title={tab.label}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="font-medium">{tab.label}</span>}
                  </button>
                );
              })}
            </div>
            {/* Market Status */}
            {!sidebarCollapsed && (
              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Markets Open</p>
                    <p className="text-xs text-slate-500">Live trading active</p>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-slate-700 dark:text-white font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </motion.div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed((v) => !v)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                ) : (
                  <X className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                )}
              </button>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </header>
        {/* Main children content */}
        <main className="flex-1 p-6 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 