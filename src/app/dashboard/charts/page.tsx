'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Volume2, 
  Target,
  RefreshCw,
  Settings
} from 'lucide-react';
import TradingChart from '../../../../components/TradingChart';

export default function ChartsPage() {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'volume' | 'rsi'>('line');
  const [marketData, setMarketData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const assets = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' }
  ];

  const timeframes = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'volume', label: 'Volume', icon: Volume2 },
    { value: 'rsi', label: 'RSI', icon: Activity }
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(`/api/charts?symbol=${selectedAsset}&timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setMarketData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [selectedAsset, selectedTimeframe]);

  const selectedAssetInfo = assets.find(a => a.id === selectedAsset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trading Charts</h1>
          <p className="text-slate-500 mt-1">
            Real-time technical analysis and market data
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <RefreshCw className="w-4 h-4" />
          <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Timeframe
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>

          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Chart Type
            </label>
            <div className="flex space-x-2">
              {chartTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setChartType(type.value as any)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      chartType === type.value
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      {marketData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">24h Volume</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              ${(marketData.marketData.volume24h / 1e6).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">24h High</p>
            <p className="text-lg font-semibold text-emerald-600">
              ${marketData.marketData.high24h.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">24h Low</p>
            <p className="text-lg font-semibold text-red-600">
              ${marketData.marketData.low24h.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">24h Change</p>
            <p className={`text-lg font-semibold ${
              marketData.marketData.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {marketData.marketData.change24h >= 0 ? '+' : ''}{marketData.marketData.change24h.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {selectedAssetInfo?.name} ({selectedAssetInfo?.symbol}) - {chartTypes.find(t => t.value === chartType)?.label}
          </h3>
        </div>
        <div className="p-6">
          <TradingChart 
            symbol={selectedAsset} 
            timeframe={selectedTimeframe} 
            chartType={chartType}
          />
        </div>
      </div>

      {/* Technical Indicators Summary */}
      {marketData && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Technical Indicators</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Moving Averages</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SMA 20:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${marketData.indicators.sma20[marketData.indicators.sma20.length - 1]?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SMA 50:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${marketData.indicators.sma50[marketData.indicators.sma50.length - 1]?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">RSI</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {marketData.indicators.rsi[marketData.indicators.rsi.length - 1]?.toFixed(0)}
                  </span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    marketData.indicators.rsi[marketData.indicators.rsi.length - 1] > 70 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : marketData.indicators.rsi[marketData.indicators.rsi.length - 1] < 30
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {marketData.indicators.rsi[marketData.indicators.rsi.length - 1] > 70 ? 'Overbought' :
                     marketData.indicators.rsi[marketData.indicators.rsi.length - 1] < 30 ? 'Oversold' : 'Neutral'}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Bollinger Bands</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Upper:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${marketData.indicators.bollinger.upper[marketData.indicators.bollinger.upper.length - 1]?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lower:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${marketData.indicators.bollinger.lower[marketData.indicators.bollinger.lower.length - 1]?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 