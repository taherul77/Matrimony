import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all users/profiles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const profiles = await Promise.all(
      users.map(async (user) => {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id }
        });
        return {
          id: user.id,
          name: user.name,
          age: user.age,
          gender: user.gender,
          bio: user.bio,
          email: user.email,
          ...profile
        };
      })
    );

    return NextResponse.json({
      profiles: profiles
    });

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
