import { NextResponse } from 'next/server';

export async function GET() {
  // Fallback data with realistic values
  const fallbackData = [
    { name: 'Bitcoin', symbol: 'BTC', price: 43500, change: 2.45, marketCap: 850000000000, prediction: 'Bullish' },
    { name: 'Ethereum', symbol: 'ETH', price: 2650, change: -1.23, marketCap: 320000000000, prediction: 'Bearish' },
    { name: 'Cardano', symbol: 'ADA', price: 0.58, change: 3.21, marketCap: 20000000000, prediction: 'Bullish' },
    { name: 'Polkadot', symbol: 'DOT', price: 7.45, change: -0.89, marketCap: 9000000000, prediction: 'Bearish' },
    { name: 'Chainlink', symbol: 'LINK', price: 15.67, change: 1.45, marketCap: 8500000000, prediction: 'Bullish' }
  ];

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink&vs_currencies=usd&include_24hr_change=true&include_market_cap=true',
      { headers: { 'Accept': 'application/json' }, next: { revalidate: 30 } }
    );
    
    if (!response.ok) {
      console.warn('CoinGecko API failed, using fallback data');
      return NextResponse.json(fallbackData);
    }
    
    const data = await response.json();
    
    const cryptoData = [
      {
        name: 'Bitcoin', symbol: 'BTC',
        price: data.bitcoin?.usd || fallbackData[0].price,
        change: data.bitcoin?.usd_24h_change || fallbackData[0].change,
        marketCap: data.bitcoin?.usd_market_cap || fallbackData[0].marketCap,
        prediction: (data.bitcoin?.usd_24h_change || fallbackData[0].change) > 0 ? 'Bullish' : 'Bearish'
      },
      {
        name: 'Ethereum', symbol: 'ETH',
        price: data.ethereum?.usd || fallbackData[1].price,
        change: data.ethereum?.usd_24h_change || fallbackData[1].change,
        marketCap: data.ethereum?.usd_market_cap || fallbackData[1].marketCap,
        prediction: (data.ethereum?.usd_24h_change || fallbackData[1].change) > 0 ? 'Bullish' : 'Bearish'
      },
      {
        name: 'Cardano', symbol: 'ADA',
        price: data.cardano?.usd || fallbackData[2].price,
        change: data.cardano?.usd_24h_change || fallbackData[2].change,
        marketCap: data.cardano?.usd_market_cap || fallbackData[2].marketCap,
        prediction: (data.cardano?.usd_24h_change || fallbackData[2].change) > 0 ? 'Bullish' : 'Bearish'
      },
      {
        name: 'Polkadot', symbol: 'DOT',
        price: data.polkadot?.usd || fallbackData[3].price,
        change: data.polkadot?.usd_24h_change || fallbackData[3].change,
        marketCap: data.polkadot?.usd_market_cap || fallbackData[3].marketCap,
        prediction: (data.polkadot?.usd_24h_change || fallbackData[3].change) > 0 ? 'Bullish' : 'Bearish'
      },
      {
        name: 'Chainlink', symbol: 'LINK',
        price: data.chainlink?.usd || fallbackData[4].price,
        change: data.chainlink?.usd_24h_change || fallbackData[4].change,
        marketCap: data.chainlink?.usd_market_cap || fallbackData[4].marketCap,
        prediction: (data.chainlink?.usd_24h_change || fallbackData[4].change) > 0 ? 'Bullish' : 'Bearish'
      }
    ];

    return NextResponse.json(cryptoData);
  } catch (error) {
    console.error('Crypto API error:', error);
    return NextResponse.json(fallbackData);
  }
} 