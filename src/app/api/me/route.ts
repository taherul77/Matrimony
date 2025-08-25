import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ isLoggedIn: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }
    });
    if (!user) {
      return NextResponse.json({ isLoggedIn: false });
    }
    return NextResponse.json({ isLoggedIn: true, user });
  } catch {
    return NextResponse.json({ isLoggedIn: false });
  }
}
