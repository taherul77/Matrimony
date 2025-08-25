import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Profile } from '@prisma/client';

const prisma = new PrismaClient();

// Get all users/profiles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // Build user filter
    const userWhere: any = {};
    if (searchParams.get('ageFrom') || searchParams.get('ageTo')) {
      userWhere.age = {};
      if (searchParams.get('ageFrom')) userWhere.age.gte = parseInt(searchParams.get('ageFrom')!);
      if (searchParams.get('ageTo')) userWhere.age.lte = parseInt(searchParams.get('ageTo')!);
    }
    if (searchParams.get('gender')) userWhere.gender = searchParams.get('gender');
    if (searchParams.get('location')) userWhere['profile'] = { location: { contains: searchParams.get('location')!, mode: 'insensitive' } };
    if (searchParams.get('religion')) userWhere['profile'] = { ...userWhere['profile'], religion: { contains: searchParams.get('religion')!, mode: 'insensitive' } };
    if (searchParams.get('caste')) userWhere['profile'] = { ...userWhere['profile'], caste: { contains: searchParams.get('caste')!, mode: 'insensitive' } };
    if (searchParams.get('education')) userWhere['profile'] = { ...userWhere['profile'], education: { contains: searchParams.get('education')!, mode: 'insensitive' } };
    if (searchParams.get('occupation')) userWhere['profile'] = { ...userWhere['profile'], occupation: { contains: searchParams.get('occupation')!, mode: 'insensitive' } };

    // Keyword search (name, location, bio)
    const keyword = searchParams.get('keyword');
    if (keyword) {
      userWhere.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { bio: { contains: keyword, mode: 'insensitive' } },
        { profile: { location: { contains: keyword, mode: 'insensitive' } } }
      ];
    }

    const users = await prisma.user.findMany({
      where: userWhere,
      include: { profile: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Use profile.id as key, but always include userId for linking
    const profiles = users.map((user) => {
      const profile: Profile | null = user.profile;
      return {
        id: profile?.id || user.id, // fallback to user.id if no profile
        userId: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        email: user.email,
        photos: profile?.photos || [],
        phone: profile?.phone || null,
        religion: profile?.religion || null,
        caste: profile?.caste || null,
        location: profile?.location || null,
        occupation: profile?.occupation || null,
        education: profile?.education || null
      };
    });

    return NextResponse.json({
      profiles: profiles
    });

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
