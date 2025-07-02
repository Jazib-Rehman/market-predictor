import { NextResponse } from 'next/server';

// Simple prediction algorithm combining price trends and technical indicators
function generatePrediction(historicalData: number[]) {
  if (historicalData.length < 3) return { direction: 'neutral', confidence: 50 };

  // Calculate moving averages
  const recent = historicalData.slice(-3);
  const older = historicalData.slice(-6, -3);
  
  const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b) / older.length;
  
  // Calculate momentum
  const momentum = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  // Calculate volatility
  const prices = historicalData.slice(-7);
  const avgPrice = prices.reduce((a, b) => a + b) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance) / avgPrice * 100;
  
  // Determine direction and confidence
  let direction = 'neutral';
  let confidence = 50;
  
  if (momentum > 2) {
    direction = 'up';
    confidence = Math.min(85, 60 + Math.abs(momentum) * 2);
  } else if (momentum < -2) {
    direction = 'down';
    confidence = Math.min(85, 60 + Math.abs(momentum) * 2);
  }
  
  // Adjust confidence based on volatility
  if (volatility > 10) confidence *= 0.8; // Lower confidence for high volatility
  
  return { direction, confidence: Math.round(confidence) };
}

// Simulate historical data (in production, fetch real historical data)
function getHistoricalData(currentPrice: number) {
  const days = 7;
  const data = [];
  let price = currentPrice;
  
  for (let i = days; i > 0; i--) {
    // Simulate price movement with some randomness
    const change = (Math.random() - 0.5) * 0.1; // ±5% daily change
    price = price * (1 + change);
    data.unshift(price);
  }
  
  return data;
}

export async function GET() {
  try {
    // Fetch current crypto prices
    const cryptoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink&vs_currencies=usd&include_24hr_change=true'
    );
    
    if (!cryptoResponse.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const cryptoData = await cryptoResponse.json();
    
    // Generate predictions for each crypto
    const predictions = Object.entries(cryptoData).map(([id, info]: [string, any]) => {
      const currentPrice = info.usd;
      const historicalData = getHistoricalData(currentPrice);
      const prediction = generatePrediction(historicalData);
      
      // Calculate target price based on prediction
      let targetPrice = currentPrice;
      if (prediction.direction === 'up') {
        targetPrice = currentPrice * (1 + (prediction.confidence / 100) * 0.15);
      } else if (prediction.direction === 'down') {
        targetPrice = currentPrice * (1 - (prediction.confidence / 100) * 0.15);
      }
      
      return {
        asset: id.charAt(0).toUpperCase() + id.slice(1),
        timeframe: '7d',
        confidence: prediction.confidence,
        direction: prediction.direction,
        target: Math.round(targetPrice * 100) / 100,
        currentPrice: currentPrice,
        analysis: generateAnalysis(prediction, info.usd_24h_change)
      };
    });
    
    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Predictions API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}

function generateAnalysis(prediction: any, dayChange: number): string {
  const { direction, confidence } = prediction;
  
  if (direction === 'up') {
    if (confidence > 75) return `Strong bullish momentum detected. Price action shows sustained upward pressure with ${confidence}% confidence.`;
    return `Moderate bullish signals emerging. Technical indicators suggest potential upward movement.`;
  } else if (direction === 'down') {
    if (confidence > 75) return `Strong bearish indicators present. Market showing signs of downward pressure with ${confidence}% confidence.`;
    return `Moderate bearish signals detected. Technical analysis suggests potential downward movement.`;
  }
  
  return `Market showing sideways movement. Mixed signals indicate consolidation phase with no clear direction.`;
} 