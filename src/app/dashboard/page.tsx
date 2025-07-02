'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Eye, 
  LogOut, 
  Clock, 
  DollarSign, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';
import SimpleChart from '../../../components/SimpleChart';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const marketData = [
    { 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      price: 43250, 
      change: 2.5, 
      prediction: 'Bullish',
      chartData: [41000, 41500, 42000, 41800, 42500, 43000, 43250]
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      price: 2680, 
      change: -1.2, 
      prediction: 'Neutral',
      chartData: [2750, 2720, 2700, 2690, 2710, 2695, 2680]
    },
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      price: 195.50, 
      change: 1.8, 
      prediction: 'Bullish',
      chartData: [192, 193, 194, 193.5, 195, 194.8, 195.5]
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc.', 
      price: 248.70, 
      change: -3.1, 
      prediction: 'Bearish',
      chartData: [256, 254, 252, 250, 249, 248.5, 248.7]
    },
  ];

  const aiPredictions = [
    { asset: 'Bitcoin', timeframe: '24h', confidence: 85, direction: 'up', target: 45000 },
    { asset: 'Ethereum', timeframe: '7d', confidence: 72, direction: 'down', target: 2500 },
    { asset: 'Apple', timeframe: '30d', confidence: 91, direction: 'up', target: 210 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
  ];

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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
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
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
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
        {/* Top Navigation */}
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
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
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-x-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Market Cap', value: '$2.4T', change: '+2.1%', positive: true },
                  { label: '24h Volume', value: '$89.2B', change: '-1.3%', positive: false },
                  { label: 'Active Assets', value: '1,247', change: '+12', positive: true },
                  { label: 'AI Accuracy', value: '94.2%', change: '+0.8%', positive: true },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      {stat.positive ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Market Assets */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Assets</h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {marketData.map((asset, index) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{asset.name}</p>
                          <p className="text-sm text-slate-500">{asset.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-12">
                          <SimpleChart data={asset.chartData} />
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            ${asset.price.toLocaleString()}
                          </p>
                          <p className={`text-sm font-medium ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Predictions</h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {aiPredictions.map((prediction, index) => (
                    <div
                      key={prediction.asset}
                      className="flex items-center justify-between p-6"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{prediction.asset}</p>
                        <p className="text-sm text-slate-500">{prediction.timeframe}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-slate-500">Confidence</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{prediction.confidence}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-500">Target</p>
                          <p className="font-semibold text-slate-900 dark:text-white">${prediction.target.toLocaleString()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          prediction.direction === 'up' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {prediction.direction === 'up' ? 'Bullish' : 'Bearish'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Portfolio Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">$124,567</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500">24h Change</p>
                    <p className="text-2xl font-bold text-emerald-500">+$2,341</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500">Holdings</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Watchlist</h3>
                <p className="text-slate-500">No assets in watchlist yet.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 