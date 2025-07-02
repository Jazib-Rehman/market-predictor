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

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  chartType: 'line' | 'candlestick' | 'volume' | 'rsi';
}

export default function TradingChart({ symbol, timeframe, chartType }: TradingChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/charts?symbol=${symbol}&timeframe=${timeframe}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  if (loading || !chartData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const labels = chartData.data.map((item: any) => 
    new Date(item.timestamp).toLocaleDateString()
  );

  const getChartConfig = () => {
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

    switch (chartType) {
      case 'line':
        return {
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: chartData.data.map((item: any) => item.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.2
              },
              {
                label: 'SMA 20',
                data: chartData.indicators.sma20,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'transparent',
                borderWidth: 1
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
              data: chartData.data.map((item: any) => item.volume),
              backgroundColor: chartData.data.map((item: any) => 
                item.close > item.open ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
              )
            }]
          },
          options: baseOptions
        };

      case 'rsi':
        return {
          data: {
            labels: labels.slice(-chartData.indicators.rsi.length),
            datasets: [
              {
                label: 'RSI',
                data: chartData.indicators.rsi,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true
              }
            ]
          },
          options: {
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: { 
                ...baseOptions.scales.y,
                min: 0,
                max: 100,
                ticks: {
                  ...baseOptions.scales.y.ticks,
                  callback: (value: any) => `${value}`
                }
              }
            },
            plugins: {
              ...baseOptions.plugins,
              annotation: {
                annotations: {
                  overbought: {
                    type: 'line',
                    yMin: 70,
                    yMax: 70,
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    borderWidth: 1
                  },
                  oversold: {
                    type: 'line',
                    yMin: 30,
                    yMax: 30,
                    borderColor: 'rgba(34, 197, 94, 0.5)',
                    borderWidth: 1
                  }
                }
              }
            }
          }
        };

      default:
        return { data: { labels: [], datasets: [] }, options: baseOptions };
    }
  };

  const config = getChartConfig();

  return (
    <div className="h-64">
      {chartType === 'volume' ? (
        <Bar data={config.data} options={config.options} />
      ) : (
        <Line data={config.data} options={config.options} />
      )}
    </div>
  );
} 