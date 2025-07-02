import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);
  
  // Temporarily allow all dashboard access to debug
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Dashboard access - temporarily allowing all');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
}; 