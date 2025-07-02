import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { verifyToken } from '../../../../../lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get token from cookie or Authorization header
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error: any) {
    console.error('User verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 