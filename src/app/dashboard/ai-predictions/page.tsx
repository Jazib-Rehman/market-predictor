"use client";
import { useAuth } from '../../../../contexts/AuthContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Bell, Clock, Sun, Moon, X as XIcon, PlusCircle } from 'lucide-react';

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allAssets = ['Bitcoin', 'Ethereum', 'Apple'];

  const aiPredictions = [
    { asset: 'Bitcoin', timeframe: '24h', confidence: 85, direction: 'up', target: 45000 },
    { asset: 'Ethereum', timeframe: '7d', confidence: 72, direction: 'down', target: 2500 },
    { asset: 'Apple', timeframe: '30d', confidence: 91, direction: 'up', target: 210 },
  ];

  const filteredPredictions = aiPredictions.filter(pred =>
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
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <main className="flex-1">
        <div className="space-y-6">
          {/* Dismissible Info Box */}
          {showInfo && (
            <div className="relative mb-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-1">How AI Market Predictions Work</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Our AI models analyze real-time market data and historical trends to provide actionable predictions for top assets. Use the filters below to customize the view. Confidence scores indicate the AI's certainty in each prediction.
                </p>
              </div>
              <button onClick={() => setShowInfo(false)} className="ml-4 text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 text-xl leading-none">&times;</button>
            </div>
          )}
          {/* Filters and Ask Button Row */}
          <div className="flex flex-wrap gap-4 mb-4 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Asset Multiselect */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Assets</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={assetSearch}
                    onChange={e => setAssetSearch(e.target.value)}
                    onFocus={() => setShowAssetDropdown(true)}
                    onBlur={() => {
                      assetDropdownTimeout.current = setTimeout(() => setShowAssetDropdown(false), 120);
                    }}
                    className="w-64 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white pr-8"
                  />
                  {assetSearch && (
                    <button
                      type="button"
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={() => setAssetSearch('')}
                      tabIndex={-1}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showAssetDropdown && (
                  <div
                    className="absolute z-10 mt-1 max-h-32 w-64 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
                    onMouseDown={e => e.preventDefault()}
                  >
                    {allAssets.filter(a => a.toLowerCase().includes(assetSearch.toLowerCase())).map(asset => (
                      <label key={asset} className="flex items-center px-3 py-1 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset)}
                          onChange={e => {
                            setSelectedAssets(sel =>
                              e.target.checked
                                ? [...sel, asset]
                                : sel.filter(a => a !== asset)
                            );
                          }}
                          className="mr-2 accent-blue-500"
                          onClick={() => {
                            if (assetDropdownTimeout.current) clearTimeout(assetDropdownTimeout.current);
                          }}
                        />
                        {asset}
                      </label>
                    ))}
                    {allAssets.filter(a => a.toLowerCase().includes(assetSearch.toLowerCase())).length === 0 && (
                      <div className="px-3 py-2 text-slate-400">No assets found</div>
                    )}
                  </div>
                )}
              </div>
              {/* Timeframe Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Timeframe</label>
                <select
                  value={timeframeFilter}
                  onChange={e => setTimeframeFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option>All</option>
                  <option>24h</option>
                  <option>3d</option>
                  <option>7d</option>
                  <option>30d</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors text-sm font-medium whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" /> Ask for prediction
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Predictions</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPredictions.map((prediction, index) => (
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
              {filteredPredictions.length === 0 && (
                <div className="p-6 text-slate-500 dark:text-slate-400 text-center">No predictions found for selected filters.</div>
              )}
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <XIcon className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ask for AI Prediction</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Coin/Company</label>
                    <input
                      type="text"
                      value={modalAsset}
                      onChange={e => setModalAsset(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                      placeholder="e.g. Bitcoin, Apple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Days to Predict</label>
                    <input
                      type="number"
                      min="1"
                      value={modalDays}
                      onChange={e => setModalDays(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                      placeholder="e.g. 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Notes (optional)</label>
                    <textarea
                      value={modalNotes}
                      onChange={e => setModalNotes(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                      rows={3}
                      placeholder="Any additional info or requirements..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm font-medium"
                      onClick={() => setShowModal(false)}
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 