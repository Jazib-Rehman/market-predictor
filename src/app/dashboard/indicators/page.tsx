'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Volume2, 
  Target,
  Brain,
  DollarSign,
  Zap,
  Gauge
} from 'lucide-react';
import IndicatorChart from '../../../../components/IndicatorChart';

export default function IndicatorsPage() {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('trend');
  const [indicatorData, setIndicatorData] = useState<any>(null);

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

  const indicatorCategories = {
    trend: {
      name: 'Trend Indicators',
      icon: TrendingUp,
      indicators: [
        { id: 'sma', name: 'Moving Averages (SMA)', description: 'Simple Moving Averages 20, 50, 100, 200' },
        { id: 'ema', name: 'Exponential Moving Average', description: 'EMA 20, 50, 100, 200' },
        { id: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence' },
        { id: 'ichimoku', name: 'Ichimoku Cloud', description: 'All-in-one trend indicator' },
        { id: 'adx', name: 'ADX', description: 'Average Directional Index' }
      ]
    },
    momentum: {
      name: 'Momentum Indicators',
      icon: Zap,
      indicators: [
        { id: 'rsi', name: 'RSI', description: 'Relative Strength Index (0-100)' },
        { id: 'stochRSI', name: 'Stochastic RSI', description: 'RSI of RSI - more sensitive' },
        { id: 'roc', name: 'Rate of Change', description: 'Momentum indicator' },
        { id: 'williamsR', name: 'Williams %R', description: 'Range-bound momentum' }
      ]
    },
    volume: {
      name: 'Volume Indicators',
      icon: Volume2,
      indicators: [
        { id: 'volume', name: 'Volume', description: 'Raw volume data' },
        { id: 'obv', name: 'On-Balance Volume', description: 'Volume flow predictor' },
        { id: 'cmf', name: 'Chaikin Money Flow', description: 'Price + volume accumulation' },
        { id: 'vwap', name: 'VWAP', description: 'Volume Weighted Average Price' }
      ]
    },
    volatility: {
      name: 'Volatility Indicators',
      icon: Activity,
      indicators: [
        { id: 'bollinger', name: 'Bollinger Bands', description: 'Price volatility bands' },
        { id: 'atr', name: 'Average True Range', description: 'Volatility measurement' },
        { id: 'donchian', name: 'Donchian Channels', description: 'Breakout indicator' }
      ]
    },
    sentiment: {
      name: 'Market Sentiment',
      icon: Brain,
      indicators: [
        { id: 'fearGreed', name: 'Fear & Greed Index', description: 'Market emotion gauge' },
        { id: 'funding', name: 'Funding Rate', description: 'Long/short bias' },
        { id: 'liquidation', name: 'Liquidation Heatmap', description: 'Liquidation zones' }
      ]
    },
    structure: {
      name: 'Price Structure',
      icon: Target,
      indicators: [
        { id: 'support', name: 'Support & Resistance', description: 'Key price levels' },
        { id: 'fibonacci', name: 'Fibonacci Retracement', description: 'Pullback and target levels' },
        { id: 'pivot', name: 'Pivot Points', description: 'Intraday reversal levels' }
      ]
    }
  };

  useEffect(() => {
    const fetchIndicatorData = async () => {
      try {
        const response = await fetch(`/api/indicators?symbol=${selectedAsset}&timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setIndicatorData(data);
      } catch (error) {
        console.error('Failed to fetch indicator data:', error);
      }
    };

    fetchIndicatorData();
    const interval = setInterval(fetchIndicatorData, 30000);
    return () => clearInterval(interval);
  }, [selectedAsset, selectedTimeframe]);

  const currentCategory = indicatorCategories[selectedCategory as keyof typeof indicatorCategories];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Technical Indicators</h1>
        <p className="text-slate-500 mt-1">
          Complete suite of 24 trading indicators with real-time calculations
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
            >
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timeframe</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
            >
              {Object.entries(indicatorCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Values */}
      {indicatorData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Current Price</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              ${indicatorData.current.price.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">RSI</p>
            <p className={`text-lg font-semibold ${
              indicatorData.current.rsi > 70 ? 'text-red-600' : 
              indicatorData.current.rsi < 30 ? 'text-green-600' : 'text-slate-900 dark:text-white'
            }`}>
              {indicatorData.current.rsi.toFixed(0)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">ADX</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {indicatorData.current.adx.toFixed(0)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Fear & Greed</p>
            <p className={`text-lg font-semibold ${
              indicatorData.current.fearGreed > 75 ? 'text-red-600' : 
              indicatorData.current.fearGreed < 25 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {indicatorData.current.fearGreed}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Funding Rate</p>
            <p className={`text-lg font-semibold ${
              indicatorData.current.fundingRate > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {(indicatorData.current.fundingRate * 100).toFixed(3)}%
            </p>
          </div>
        </div>
      )}

      {/* Category Indicators */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <currentCategory.icon className="w-5 h-5 mr-2" />
            {currentCategory.name}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentCategory.indicators.map((indicator) => (
              <div key={indicator.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="mb-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">{indicator.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{indicator.description}</p>
                </div>
                <IndicatorChart 
                  symbol={selectedAsset} 
                  timeframe={selectedTimeframe} 
                  indicatorType={indicator.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {indicatorData && selectedCategory === 'sentiment' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Market Sentiment Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Fear & Greed Index</h4>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-green-500 flex items-center justify-center">
                  <span className="text-white font-bold">{indicatorData.current.fearGreed}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Market Emotion</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {indicatorData.current.fearGreed > 75 ? 'Extreme Greed' :
                     indicatorData.current.fearGreed > 55 ? 'Greed' :
                     indicatorData.current.fearGreed > 45 ? 'Neutral' :
                     indicatorData.current.fearGreed > 25 ? 'Fear' : 'Extreme Fear'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Support & Resistance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Resistance:</span>
                  <span className="font-medium text-red-600">
                    ${indicatorData.indicators.supportResistance.resistance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Support:</span>
                  <span className="font-medium text-green-600">
                    ${indicatorData.indicators.supportResistance.support.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Pivot Points</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">R2:</span>
                  <span className="text-red-600">${indicatorData.indicators.pivotPoints.r2.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">R1:</span>
                  <span className="text-red-500">${indicatorData.indicators.pivotPoints.r1.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pivot:</span>
                  <span className="font-medium text-slate-900 dark:text-white">${indicatorData.indicators.pivotPoints.pivot.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">S1:</span>
                  <span className="text-green-500">${indicatorData.indicators.pivotPoints.s1.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">S2:</span>
                  <span className="text-green-600">${indicatorData.indicators.pivotPoints.s2.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 