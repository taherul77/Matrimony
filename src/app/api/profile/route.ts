import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET user profile
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    // Get preferences
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: user.id }
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        user: userWithoutPassword,
        profile: profile || null,
        preferences: preferences || null
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const body = await request.json();
    const { name, bio, religion, caste, location, occupation, education, photos } = body;

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: name || undefined,
        bio: bio || undefined
      }
    });

    // Update or create profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: decoded.userId },
      update: {
        religion: religion || undefined,
        caste: caste || undefined,
        location: location || undefined,
        occupation: occupation || undefined,
        education: education || undefined,
        photos: photos || undefined
      },
      create: {
        userId: decoded.userId,
        religion: religion || null,
        caste: caste || null,
        location: location || null,
        occupation: occupation || null,
        education: education || null,
        photos: photos || []
      }
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: userWithoutPassword,
        profile: updatedProfile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
