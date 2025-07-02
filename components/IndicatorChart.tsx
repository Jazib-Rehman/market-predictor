import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IndicatorChartProps {
  symbol: string;
  timeframe: string;
  indicatorType: string;
}

export default function IndicatorChart({ symbol, timeframe, indicatorType }: IndicatorChartProps) {
  const [indicatorData, setIndicatorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicatorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/indicators?symbol=${symbol}&timeframe=${timeframe}`);
        const data = await response.json();
        setIndicatorData(data);
      } catch (error) {
        console.error('Failed to fetch indicator data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicatorData();
    const interval = setInterval(fetchIndicatorData, 30000);
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  if (loading || !indicatorData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const labels = indicatorData.data.map((item: any) => 
    new Date(item.timestamp).toLocaleDateString()
  );

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: 'rgb(148, 163, 184)' }
      },
      y: { 
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: 'rgb(148, 163, 184)' }
      }
    },
    plugins: {
      legend: { 
        labels: { color: 'rgb(148, 163, 184)' }
      }
    }
  };

  const getChartConfig = () => {
    switch (indicatorType) {
      case 'sma':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: indicatorData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false
              },
              {
                label: 'SMA 20',
                data: indicatorData.indicators.sma.sma20,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent'
              },
              {
                label: 'SMA 50',
                data: indicatorData.indicators.sma.sma50,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'transparent'
              }
            ]
          },
          options: baseOptions
        };

      case 'ema':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: indicatorData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false
              },
              {
                label: 'EMA 20',
                data: indicatorData.indicators.ema.ema20,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent'
              },
              {
                label: 'EMA 50',
                data: indicatorData.indicators.ema.ema50,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'transparent'
              }
            ]
          },
          options: baseOptions
        };

      case 'rsi':
        return {
          data: {
            labels,
            datasets: [{
              label: 'RSI',
              data: indicatorData.indicators.rsi,
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              fill: true
            }]
          },
          options: {
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: { ...baseOptions.scales.y, min: 0, max: 100 }
            }
          }
        };

      case 'macd':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'MACD Line',
                data: indicatorData.indicators.macd.macdLine,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'transparent'
              },
              {
                label: 'Signal Line',
                data: indicatorData.indicators.macd.signalLine,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent'
              }
            ]
          },
          options: baseOptions
        };

      case 'bollinger':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: indicatorData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'transparent'
              },
              {
                label: 'Upper Band',
                data: indicatorData.indicators.bollingerBands.map((band: any) => band.upper),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent',
                borderDash: [5, 5]
              },
              {
                label: 'Lower Band',
                data: indicatorData.indicators.bollingerBands.map((band: any) => band.lower),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'transparent',
                borderDash: [5, 5]
              }
            ]
          },
          options: baseOptions
        };

      case 'ichimoku':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: indicatorData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'transparent'
              },
              {
                label: 'Tenkan-sen',
                data: indicatorData.indicators.ichimoku.tenkanSen,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent'
              },
              {
                label: 'Kijun-sen',
                data: indicatorData.indicators.ichimoku.kijunSen,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'transparent'
              },
              {
                label: 'Senkou Span A',
                data: indicatorData.indicators.ichimoku.senkouSpanA,
                borderColor: 'rgba(168, 85, 247, 0.5)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: '+1'
              }
            ]
          },
          options: baseOptions
        };

      case 'volume':
        return {
          data: {
            labels,
            datasets: [{
              label: 'Volume',
              data: indicatorData.indicators.volume,
              backgroundColor: indicatorData.data.map((item: any, index: number) => 
                index > 0 && item.close > indicatorData.data[index - 1].close 
                  ? 'rgba(34, 197, 94, 0.7)' 
                  : 'rgba(239, 68, 68, 0.7)'
              )
            }]
          },
          options: baseOptions
        };

      case 'stochRSI':
        return {
          data: {
            labels,
            datasets: [{
              label: 'Stochastic RSI',
              data: indicatorData.indicators.stochRSI,
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              fill: true
            }]
          },
          options: {
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: { ...baseOptions.scales.y, min: 0, max: 100 }
            }
          }
        };

      case 'atr':
        return {
          data: {
            labels,
            datasets: [{
              label: 'Average True Range',
              data: indicatorData.indicators.atr,
              borderColor: 'rgb(251, 191, 36)',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              fill: true
            }]
          },
          options: baseOptions
        };

      case 'obv':
        return {
          data: {
            labels,
            datasets: [{
              label: 'On-Balance Volume',
              data: indicatorData.indicators.obv,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true
            }]
          },
          options: baseOptions
        };

      case 'vwap':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: indicatorData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'transparent'
              },
              {
                label: 'VWAP',
                data: indicatorData.indicators.vwap,
                borderColor: 'rgb(251, 191, 36)',
                backgroundColor: 'transparent',
                borderWidth: 2
              }
            ]
          },
          options: baseOptions
        };

      default:
        return {
          data: { labels: [], datasets: [] },
          options: baseOptions
        };
    }
  };

  const config = getChartConfig();

  return (
    <div className="h-64">
      {indicatorType === 'volume' ? (
        <Bar data={config.data} options={config.options} />
      ) : (
        <Line data={config.data} options={config.options} />
      )}
    </div>
  );
} 