"use client";
import { useAuth } from '../../../../contexts/AuthContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Bell, Clock, Sun, Moon, X as XIcon, PlusCircle, Brain, TrendingUp, TrendingDown } from 'lucide-react';

export default function AiPredictionsPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(true);
  const [assetSearch, setAssetSearch] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [timeframeFilter, setTimeframeFilter] = useState('All');
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const assetDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAsset, setModalAsset] = useState('');
  const [modalDays, setModalDays] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch AI predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('/api/predictions');
        if (!response.ok) throw new Error('Predictions API failed');
        const data = await response.json();
        setAiPredictions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
        // Set fallback predictions
        setAiPredictions([
          {
            asset: 'Bitcoin',
            currentPrice: 43500,
            targetPrice: 46200,
            confidence: 75,
            direction: 'up',
            timeframe: '24h',
            analysis: 'API temporarily unavailable - showing cached prediction'
          }
        ]);
      } finally {
        setPredictionsLoading(false);
      }
    };

    fetchPredictions();
    // Refresh predictions every 5 minutes
    const interval = setInterval(fetchPredictions, 300000);
    return () => clearInterval(interval);
  }, []);

  const allAssets = ['Bitcoin', 'Ethereum', 'Cardano', 'Polkadot', 'Chainlink'];

  const filteredPredictions = aiPredictions.filter((pred: any) =>
    (selectedAssets.length === 0 || selectedAssets.includes(pred.asset)) &&
    (timeframeFilter === 'All' || pred.timeframe === timeframeFilter)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <main className="flex-1">
        <div className="space-y-6">
          {/* Dismissible Info Box */}
          {showInfo && (
            <div className="relative mb-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-1 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI-Powered Market Predictions
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Our AI analyzes price trends, technical indicators, and market momentum to generate predictions. Predictions update every 5 minutes with confidence scores and target prices.
                </p>
              </div>
              <button onClick={() => setShowInfo(false)} className="ml-4 text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 text-xl leading-none">&times;</button>
            </div>
          )}

          {/* Filters and Ask Button Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Asset Filter */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    onFocus={() => setShowAssetDropdown(true)}
                    onBlur={() => {
                      assetDropdownTimeout.current = setTimeout(() => setShowAssetDropdown(false), 200);
                    }}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  {selectedAssets.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedAssets([]);
                        setAssetSearch('');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {showAssetDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    {allAssets
                      .filter(asset => asset.toLowerCase().includes(assetSearch.toLowerCase()))
                      .map(asset => (
                        <button
                          key={asset}
                          onClick={() => {
                            if (!selectedAssets.includes(asset)) {
                              setSelectedAssets([...selectedAssets, asset]);
                            }
                            setAssetSearch('');
                            setShowAssetDropdown(false);
                            if (assetDropdownTimeout.current) {
                              clearTimeout(assetDropdownTimeout.current);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg"
                        >
                          {asset}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Timeframe Filter */}
              <select
                value={timeframeFilter}
                onChange={(e) => setTimeframeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="All">All Timeframes</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>

            {/* Ask for Prediction Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Prediction</span>
            </button>
          </div>

          {/* Selected Assets Display */}
          {selectedAssets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedAssets.map(asset => (
                <span
                  key={asset}
                  className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>{asset}</span>
                  <button
                    onClick={() => setSelectedAssets(selectedAssets.filter(a => a !== asset))}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* AI Predictions List */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                AI Predictions
                {predictionsLoading && (
                  <div className="ml-3 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {predictionsLoading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-500">Generating AI predictions...</p>
                </div>
              ) : filteredPredictions.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No predictions match your filters.
                </div>
              ) : (
                filteredPredictions.map((prediction: any, index) => (
                  <div
                    key={prediction.asset}
                    className="p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{prediction.asset.slice(0, 3).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{prediction.asset}</p>
                          <p className="text-sm text-slate-500">{prediction.timeframe} prediction</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-slate-500">Current</p>
                          <p className="font-semibold text-slate-900 dark:text-white">${prediction.currentPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-500">Target</p>
                          <p className="font-semibold text-slate-900 dark:text-white">${prediction.targetPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-500">Confidence</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{prediction.confidence}%</p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                          prediction.direction === 'up' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : prediction.direction === 'down'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {prediction.direction === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : prediction.direction === 'down' ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : null}
                          <span>
                            {prediction.direction === 'up' ? 'Bullish' : 
                             prediction.direction === 'down' ? 'Bearish' : 'Neutral'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong>AI Analysis:</strong> {prediction.analysis}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Request Prediction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Request Custom Prediction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Coin/Company
                </label>
                <input
                  type="text"
                  value={modalAsset}
                  onChange={(e) => setModalAsset(e.target.value)}
                  placeholder="e.g., Bitcoin, Apple"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Days to Predict
                </label>
                <select
                  value={modalDays}
                  onChange={(e) => setModalDays(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="">Select timeframe</option>
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Any specific factors to consider..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle prediction request
                    console.log('Requesting prediction for:', modalAsset, modalDays, modalNotes);
                    setShowModal(false);
                    setModalAsset('');
                    setModalDays('');
                    setModalNotes('');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 