import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'bitcoin';
  const timeframe = searchParams.get('timeframe') || '24h';
  
  // Generate realistic OHLCV data
  const generateOHLCV = (points: number, basePrice: number) => {
    const data = [];
    let currentPrice = basePrice;
    const now = Date.now();
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * (timeframe === '1h' ? 3600000 : timeframe === '24h' ? 86400000 : 604800000));
      const change = (Math.random() - 0.5) * 0.04; // 4% max change
      const open = currentPrice;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      const volume = Math.random() * 1000000 + 500000;
      
      data.push({ timestamp, open, high, low, close, volume });
      currentPrice = close;
    }
    return data;
  };

  // Technical indicators
  const calculateSMA = (data: any[], period: number) => {
    return data.map((_, index) => {
      if (index < period - 1) return null;
      const sum = data.slice(index - period + 1, index + 1).reduce((acc, item) => acc + item.close, 0);
      return sum / period;
    });
  };

  const calculateRSI = (data: any[], period: number = 14) => {
    const changes = data.map((item, index) => 
      index === 0 ? 0 : item.close - data[index - 1].close
    );
    
    return changes.map((_, index) => {
      if (index < period) return 50;
      const gains = changes.slice(index - period + 1, index + 1).filter(c => c > 0);
      const losses = changes.slice(index - period + 1, index + 1).filter(c => c < 0).map(Math.abs);
      const avgGain = gains.reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
      return avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
    });
  };

  try {
    const points = timeframe === '1h' ? 24 : timeframe === '24h' ? 30 : 52;
    const basePrices: any = {
      bitcoin: 43500, ethereum: 2650, cardano: 0.58, polkadot: 7.45, chainlink: 15.67
    };
    
    const ohlcv = generateOHLCV(points, basePrices[symbol] || 100);
    const sma20 = calculateSMA(ohlcv, 20);
    const sma50 = calculateSMA(ohlcv, Math.min(50, points));
    const rsi = calculateRSI(ohlcv);
    
    const response = {
      symbol,
      timeframe,
      data: ohlcv,
      indicators: {
        sma20: sma20.filter(v => v !== null),
        sma50: sma50.filter(v => v !== null),
        rsi: rsi.slice(-10), // Last 10 RSI values
        bollinger: {
          upper: sma20.map(v => v ? v * 1.02 : null).filter(v => v !== null),
          lower: sma20.map(v => v ? v * 0.98 : null).filter(v => v !== null)
        }
      },
      marketData: {
        volume24h: ohlcv.reduce((sum, item) => sum + item.volume, 0),
        high24h: Math.max(...ohlcv.map(item => item.high)),
        low24h: Math.min(...ohlcv.map(item => item.low)),
        change24h: ((ohlcv[ohlcv.length - 1].close - ohlcv[0].open) / ohlcv[0].open) * 100
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Charts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
} 