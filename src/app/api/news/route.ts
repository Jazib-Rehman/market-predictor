import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Using NewsAPI or CryptoNews - free tier
    const response = await fetch(
      'https://newsapi.org/v2/everything?q=bitcoin OR ethereum OR cryptocurrency&sortBy=publishedAt&pageSize=10&apiKey=demo'
    );
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      const mockNews = [
        {
          title: "Bitcoin Reaches New Monthly High",
          description: "Bitcoin continues its upward trajectory as institutional adoption increases.",
          url: "#",
          publishedAt: new Date().toISOString(),
          source: { name: "Crypto Today" },
          sentiment: "positive"
        },
        {
          title: "Ethereum Network Upgrade Shows Promise",
          description: "Latest Ethereum improvements could impact transaction costs significantly.",
          url: "#",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "Blockchain News" },
          sentiment: "positive"
        },
        {
          title: "Market Analysis: Crypto Volatility Continues",
          description: "Experts weigh in on recent market movements and future predictions.",
          url: "#",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "Market Watch" },
          sentiment: "neutral"
        }
      ];
      return NextResponse.json(mockNews);
    }
    
    const data = await response.json();
    
    // Transform and add sentiment analysis
    const newsWithSentiment = data.articles?.slice(0, 10).map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source,
      sentiment: analyzeSentiment(article.title + ' ' + article.description)
    })) || [];
    
    return NextResponse.json(newsWithSentiment);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['surge', 'rise', 'gain', 'bull', 'high', 'up', 'growth', 'increase', 'rally'];
  const negativeWords = ['crash', 'fall', 'drop', 'bear', 'down', 'decline', 'loss', 'sell'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
} 