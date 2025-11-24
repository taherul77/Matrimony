import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // Fetch same minimal data as the main profiles endpoint so versions match
    const users = await prisma.user.findMany({
      include: { profile: true },
      skip,
      take: limit,
    });

    // Normalize to the same shape returned by profiles route
    const profiles = users.map((user: any) => {
      const profile = user.profile || {};
      return {
        id: profile.id || user.id,
        userId: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        email: user.email,
        photos: profile.photos || [],
        phone: profile.phone || null,
        religion: profile.religion || null,
        caste: profile.caste || null,
        location: profile.location || null,
        occupation: profile.occupation || null,
        education: profile.education || null,
        maritalStatus: profile.maritalStatus || null,
        minHeight: profile.minHeight || null,
        maxHeight: profile.maxHeight || null,
        minIncome: profile.minIncome || null,
        maxIncome: profile.maxIncome || null,
        lifestyle: profile.lifestyle || null,
        languages: profile.languages || [],
        country: profile.country || null,
      };
    });

    // Compute a SHA256 hash of the JSON representation
    const hash = crypto.createHash('sha256').update(JSON.stringify(profiles)).digest('hex');

    return NextResponse.json({ version: hash, count: profiles.length });
  } catch (error) {
    console.error('Error computing profiles meta:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
