import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// PUT: Update user preferences
export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;
    const body = await request.json();
    // Parse numeric fields safely
  const parseNum = (val: any) => {
      if (val === undefined || val === null || val === '') return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    };
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        minAge: parseNum(body.minAge),
        maxAge: parseNum(body.maxAge),
        gender: body.gender ?? undefined,
        religion: body.religion ?? undefined,
        caste: body.caste ?? undefined,
        location: body.location ?? undefined,
        maritalStatus: body.maritalStatus ?? undefined,
        minHeight: parseNum(body.minHeight),
        maxHeight: parseNum(body.maxHeight),
        education: body.education ?? undefined,
        occupation: body.occupation ?? undefined,
        minIncome: parseNum(body.minIncome),
        maxIncome: parseNum(body.maxIncome),
        lifestyle: body.lifestyle ?? undefined,
        languages: body.languages ?? undefined,
        country: body.country ?? undefined,
      },
      create: {
        userId,
        minAge: parseNum(body.minAge),
        maxAge: parseNum(body.maxAge),
        gender: body.gender ?? undefined,
        religion: body.religion ?? undefined,
        caste: body.caste ?? undefined,
        location: body.location ?? undefined,
        maritalStatus: body.maritalStatus ?? undefined,
        minHeight: parseNum(body.minHeight),
        maxHeight: parseNum(body.maxHeight),
        education: body.education ?? undefined,
        occupation: body.occupation ?? undefined,
        minIncome: parseNum(body.minIncome),
        maxIncome: parseNum(body.maxIncome),
        lifestyle: body.lifestyle ?? undefined,
        languages: body.languages ?? undefined,
        country: body.country ?? undefined,
      },
    });
    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}

// GET: Get user preferences
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;
    const preferences = await prisma.userPreference.findUnique({ where: { userId } });
    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}
