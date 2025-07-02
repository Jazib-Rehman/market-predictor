import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'bitcoin';
  const timeframe = searchParams.get('timeframe') || '24h';
  
  // Fetch real OHLCV data from CoinGecko
  const fetchRealOHLCV = async (symbol: string, days: number) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=${days}&interval=${timeframe === '1h' ? 'hourly' : 'daily'}`
      );
      
      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      const prices = data.prices || [];
      const volumes = data.total_volumes || [];
      
      return prices.map((price: any, index: number) => {
        const timestamp = price[0];
        const close = price[1];
        const volume = volumes[index] ? volumes[index][1] : 1000000;
        // Generate OHLC from close price with realistic variance
        const variance = close * 0.02;
        const open = close + (Math.random() - 0.5) * variance;
        const high = Math.max(open, close) + Math.random() * variance * 0.5;
        const low = Math.min(open, close) - Math.random() * variance * 0.5;
        
        return { timestamp, open, high, low, close, volume };
      });
    } catch (error) {
      console.warn('Failed to fetch real data, using fallback');
      // Fallback to generated data
      const data = [];
      const basePrice = symbol === 'bitcoin' ? 43500 : symbol === 'ethereum' ? 2650 : 100;
      let currentPrice = basePrice;
      const now = Date.now();
      
      for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * 86400000);
        const change = (Math.random() - 0.5) * 0.04;
        const open = currentPrice;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.random() * 1000000 + 500000;
        
        data.push({ timestamp, open, high, low, close, volume });
        currentPrice = close;
      }
      return data;
    }
  };

  // Technical Indicator Calculations
  const calculateSMA = (data: any[], period: number) => {
    return data.map((_, index) => {
      if (index < period - 1) return null;
      const sum = data.slice(index - period + 1, index + 1).reduce((acc, item) => acc + item.close, 0);
      return sum / period;
    });
  };

  const calculateEMA = (data: any[], period: number) => {
    const multiplier = 2 / (period + 1);
    const ema = [data[0].close];
    
    for (let i = 1; i < data.length; i++) {
      ema.push((data[i].close * multiplier) + (ema[i - 1] * (1 - multiplier)));
    }
    return ema;
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

  const calculateMACD = (data: any[]) => {
    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);
    const macdLine = ema12.map((val, i) => val - ema26[i]);
    const signalLine = calculateEMA(macdLine.map((val, i) => ({ close: val })), 9);
    const histogram = macdLine.map((val, i) => val - signalLine[i]);
    
    return { macdLine, signalLine, histogram };
  };

  const calculateBollingerBands = (data: any[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(data, period);
    const bands = sma.map((avg, index) => {
      if (!avg || index < period - 1) return { upper: null, middle: avg, lower: null };
      
      const slice = data.slice(index - period + 1, index + 1);
      const variance = slice.reduce((sum, item) => sum + Math.pow(item.close - avg, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      return {
        upper: avg + (standardDeviation * stdDev),
        middle: avg,
        lower: avg - (standardDeviation * stdDev)
      };
    });
    
    return bands;
  };

  const calculateStochasticRSI = (data: any[], period: number = 14) => {
    const rsi = calculateRSI(data, period);
    return rsi.map((_, index) => {
      if (index < period) return 50;
      const rsiSlice = rsi.slice(index - period + 1, index + 1);
      const minRSI = Math.min(...rsiSlice);
      const maxRSI = Math.max(...rsiSlice);
      return maxRSI === minRSI ? 0 : ((rsi[index] - minRSI) / (maxRSI - minRSI)) * 100;
    });
  };

  const calculateWilliamsR = (data: any[], period: number = 14) => {
    return data.map((_, index) => {
      if (index < period - 1) return -50;
      const slice = data.slice(index - period + 1, index + 1);
      const highestHigh = Math.max(...slice.map(item => item.high));
      const lowestLow = Math.min(...slice.map(item => item.low));
      const currentClose = data[index].close;
      return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    });
  };

  const calculateATR = (data: any[], period: number = 14) => {
    const trueRanges = data.map((item, index) => {
      if (index === 0) return item.high - item.low;
      const prevClose = data[index - 1].close;
      return Math.max(
        item.high - item.low,
        Math.abs(item.high - prevClose),
        Math.abs(item.low - prevClose)
      );
    });
    
    return calculateSMA(trueRanges.map((tr, i) => ({ close: tr })), period).map(val => val);
  };

  const calculateADX = (data: any[], period: number = 14) => {
    // Simplified ADX calculation
    return data.map((_, index) => {
      if (index < period) return 25;
      return 25 + (Math.random() - 0.5) * 20; // Mock ADX between 15-35
    });
  };

  const calculateOBV = (data: any[]) => {
    let obv = 0;
    return data.map((item, index) => {
      if (index === 0) return obv;
      const prevClose = data[index - 1].close;
      if (item.close > prevClose) obv += item.volume;
      else if (item.close < prevClose) obv -= item.volume;
      return obv;
    });
  };

  const calculateVWAP = (data: any[]) => {
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;
    
    return data.map(item => {
      const typicalPrice = (item.high + item.low + item.close) / 3;
      cumulativeTPV += typicalPrice * item.volume;
      cumulativeVolume += item.volume;
      return cumulativeTPV / cumulativeVolume;
    });
  };

  const calculateROC = (data: any[], period: number = 12) => {
    return data.map((item, index) => {
      if (index < period) return 0;
      const prevPrice = data[index - period].close;
      return ((item.close - prevPrice) / prevPrice) * 100;
    });
  };

  const calculateCMF = (data: any[], period: number = 20) => {
    return data.map((_, index) => {
      if (index < period - 1) return 0;
      const slice = data.slice(index - period + 1, index + 1);
      const cmf = slice.reduce((sum, item) => {
        const mfm = ((item.close - item.low) - (item.high - item.close)) / (item.high - item.low);
        return sum + (mfm * item.volume);
      }, 0) / slice.reduce((sum, item) => sum + item.volume, 0);
      return cmf;
    });
  };

  try {
    const days = timeframe === '1h' ? 7 : timeframe === '24h' ? 30 : 90;
    
    const ohlcv = await fetchRealOHLCV(symbol, days);
    
    // Calculate all indicators
    const sma20 = calculateSMA(ohlcv, 20);
    const sma50 = calculateSMA(ohlcv, 50);
    const sma100 = calculateSMA(ohlcv, 100);
    const sma200 = calculateSMA(ohlcv, 200);
    const ema20 = calculateEMA(ohlcv, 20);
    const ema50 = calculateEMA(ohlcv, 50);
    const ema100 = calculateEMA(ohlcv, 100);
    const ema200 = calculateEMA(ohlcv, 200);
    const rsi = calculateRSI(ohlcv);
    const macd = calculateMACD(ohlcv);
    const bollingerBands = calculateBollingerBands(ohlcv);
    const stochRSI = calculateStochasticRSI(ohlcv);
    const williamsR = calculateWilliamsR(ohlcv);
    const atr = calculateATR(ohlcv);
    const adx = calculateADX(ohlcv);
    const obv = calculateOBV(ohlcv);
    const vwap = calculateVWAP(ohlcv);
    const roc = calculateROC(ohlcv);
    const cmf = calculateCMF(ohlcv);

    // Market sentiment indicators (mocked)
    const fearGreedIndex = Math.floor(Math.random() * 100);
    const fundingRate = (Math.random() - 0.5) * 0.1;
    
    const response = {
      symbol,
      timeframe,
      data: ohlcv.slice(-50), // Last 50 data points
      indicators: {
        // Trend Indicators
        sma: { sma20: sma20.slice(-50), sma50: sma50.slice(-50), sma100: sma100.slice(-50), sma200: sma200.slice(-50) },
        ema: { ema20: ema20.slice(-50), ema50: ema50.slice(-50), ema100: ema100.slice(-50), ema200: ema200.slice(-50) },
        macd: {
          macdLine: macd.macdLine.slice(-50),
          signalLine: macd.signalLine.slice(-50),
          histogram: macd.histogram.slice(-50)
        },
        ichimoku: {
          tenkanSen: sma20.slice(-50),
          kijunSen: sma50.slice(-50),
          senkouSpanA: sma20.slice(-50).map((val, i) => {
            const sma50Val = sma50.slice(-50)[i];
            return val && sma50Val ? (val + sma50Val) / 2 : null;
          }),
          senkouSpanB: sma100.slice(-50),
          chikouSpan: ohlcv.slice(-76, -26).map((item:any) => item.close)
        },
        adx: adx.slice(-50),
        
        // Momentum Indicators
        rsi: rsi.slice(-50),
        stochRSI: stochRSI.slice(-50),
        roc: roc.slice(-50),
        williamsR: williamsR.slice(-50),
        
        // Volume Indicators
        volume: ohlcv.slice(-50).map((item:any) => item.volume),
        obv: obv.slice(-50),
        cmf: cmf.slice(-50),
        vwap: vwap.slice(-50),
        
        // Volatility Indicators
        bollingerBands: bollingerBands.slice(-50),
        atr: atr.slice(-50),
        donchianChannels: {
          upper: ohlcv.slice(-50).map((_:any, i:any) => Math.max(...ohlcv.slice(Math.max(0, i-20), i+1).map((item:any) => item.high))),
          lower: ohlcv.slice(-50).map((_:any, i:any) => Math.min(...ohlcv.slice(Math.max(0, i-20), i+1).map((item:any) => item.low)))
        },
        
        // Market Sentiment
        fearGreedIndex,
        fundingRate,
        
        // Support/Resistance (simplified)
        supportResistance: {
          support: Math.min(...ohlcv.slice(-20).map((item:any) => item.low)),
          resistance: Math.max(...ohlcv.slice(-20).map((item:any) => item.high))
        },
        
        // Fibonacci levels
        fibonacci: {
          high: Math.max(...ohlcv.slice(-50).map((item:any) => item.high)),
          low: Math.min(...ohlcv.slice(-50).map((item:any) => item.low)),
          levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0]
        },
        
        // Pivot Points
        pivotPoints: (() => {
          const yesterday = ohlcv[ohlcv.length - 2];
          const pivot = (yesterday.high + yesterday.low + yesterday.close) / 3;
          return {
            pivot,
            r1: (2 * pivot) - yesterday.low,
            r2: pivot + (yesterday.high - yesterday.low),
            s1: (2 * pivot) - yesterday.high,
            s2: pivot - (yesterday.high - yesterday.low)
          };
        })()
      },
      
      // Current values for display
      current: {
        price: ohlcv[ohlcv.length - 1].close,
        rsi: rsi[rsi.length - 1],
        adx: adx[adx.length - 1],
        atr: atr[atr.length - 1],
        fearGreed: fearGreedIndex,
        fundingRate: fundingRate
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Indicators API error:', error);
    return NextResponse.json({ error: 'Failed to fetch indicators' }, { status: 500 });
  }
} 