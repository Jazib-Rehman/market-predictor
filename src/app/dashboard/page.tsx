'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
import { useSocket } from '../../../contexts/SocketContext';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { socket } = useSocket();

  // Middleware handles auth redirect, no need for client-side check

  // Fetch crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCryptoData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Confetti moved to layout

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

  const aiPredictions = [
    { asset: 'Bitcoin', timeframe: '24h', confidence: 85, direction: 'up', target: 45000 },
    { asset: 'Ethereum', timeframe: '7d', confidence: 72, direction: 'down', target: 2500 },
    { asset: 'Cardano', timeframe: '30d', confidence: 91, direction: 'up', target: 0.65 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <main className="flex-1 overflow-x-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Market Cap', value: '$2.4T', change: '+2.1%', positive: true },
                  { label: '24h Volume', value: '$89.2B', change: '-1.3%', positive: false },
                  { label: 'Active Assets', value: marketData.length.toString(), change: '+12', positive: true },
                  { label: 'Live Data', value: dataLoading ? 'Loading...' : 'Active', change: '30s refresh', positive: true },
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
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live Crypto Data</h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {dataLoading ? (
                    <div className="p-6 text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-slate-500">Loading live data...</p>
                    </div>
                  ) : (
                    marketData.map((asset: any, index) => (
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
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              ${asset.price.toLocaleString()}
                            </p>
                            <p className={`text-sm font-medium ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            asset.prediction === 'Bullish' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {asset.prediction}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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