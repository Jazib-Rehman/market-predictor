'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SimpleChart from '../../../components/SimpleChart';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
                <span className="text-xl font-bold text-white">MarketPredictor</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </div>
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <div className="p-4">
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'overview' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📊</span>
                    <span className="font-medium">Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('predictions')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'predictions' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔮</span>
                    <span className="font-medium">AI Predictions</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'portfolio' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💼</span>
                    <span className="font-medium">Portfolio</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'watchlist' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">👁️</span>
                    <span className="font-medium">Watchlist</span>
                  </div>
                </button>
              </nav>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Market Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">Markets Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white">Market Overview</h1>
              
              {/* Market Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold">Total Market Cap</h3>
                  <p className="text-2xl font-bold">$2.1T</p>
                  <p className="text-green-100">↗ +2.3% (24h)</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold">Bitcoin Dominance</h3>
                  <p className="text-2xl font-bold">51.2%</p>
                  <p className="text-blue-100">↗ +0.8% (24h)</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold">Active Predictions</h3>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-purple-100">📈 85% accuracy</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold">Portfolio Value</h3>
                  <p className="text-2xl font-bold">$12,450</p>
                  <p className="text-orange-100">↗ +5.2% (24h)</p>
                </div>
              </div>

              {/* Top Assets */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top Assets</h2>
                                 <div className="space-y-4">
                   {marketData.map((asset) => (
                     <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                       <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                           {asset.symbol.slice(0, 2)}
                         </div>
                         <div>
                           <h3 className="text-white font-semibold">{asset.name}</h3>
                           <p className="text-gray-400">{asset.symbol}</p>
                         </div>
                       </div>
                       
                       <div className="hidden md:block">
                         <SimpleChart 
                           data={asset.chartData} 
                           width={120} 
                           height={50}
                           className="opacity-80 hover:opacity-100 transition-opacity"
                         />
                       </div>
                       
                       <div className="text-right">
                         <p className="text-white font-semibold">${asset.price.toLocaleString()}</p>
                         <p className={`text-sm ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {asset.change > 0 ? '+' : ''}{asset.change}%
                         </p>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                         asset.prediction === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                         asset.prediction === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                         'bg-yellow-500/20 text-yellow-400'
                       }`}>
                         {asset.prediction}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white">AI Predictions</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiPredictions.map((prediction, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{prediction.asset}</h3>
                      <span className="text-sm text-gray-400">{prediction.timeframe}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white font-semibold">{prediction.confidence}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl ${prediction.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {prediction.direction === 'up' ? '↗' : '↘'}
                          </span>
                          <span className="text-white">Target: ${prediction.target.toLocaleString()}</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">AI Model Performance</h3>
                <p className="text-blue-100 mb-4">Our AI has achieved 89% accuracy over the last 30 days</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-blue-100">Correct Predictions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">19</p>
                    <p className="text-blue-100">Incorrect Predictions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-blue-100">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white">Portfolio</h1>
              
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Portfolio Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">$12,450</p>
                    <p className="text-gray-400">Total Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">+$645</p>
                    <p className="text-gray-400">24h Change</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">+5.47%</p>
                    <p className="text-gray-400">24h %</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Holdings</h2>
                <div className="text-center text-gray-400 py-8">
                  <p>No holdings yet. Start by adding assets to your portfolio!</p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Add Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white">Watchlist</h1>
              
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Your Watchlist</h2>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Add Asset
                  </button>
                </div>
                
                <div className="text-center text-gray-400 py-8">
                  <p>Your watchlist is empty. Add assets to track their performance!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 