import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    
    // Transform data to match our app format
    const cryptoData = Object.entries(data).map(([id, info]: [string, any]) => ({
      symbol: id.toUpperCase().slice(0, 3),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: info.usd,
      change: info.usd_24h_change || 0,
      marketCap: info.usd_market_cap || 0,
      prediction: info.usd_24h_change > 0 ? 'Bullish' : 'Bearish'
    }));
    
    return NextResponse.json(cryptoData);
  } catch (error) {
    console.error('Crypto API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto data' },
      { status: 500 }
    );
  }
} 