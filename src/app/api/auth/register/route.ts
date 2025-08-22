import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, age, gender, location, phone, religion, caste, profileImage } = body;

    // Validate required fields
    if (!name || !email || !password || !age || !gender || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, age, gender, location' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 100' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user first
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: parseInt(age),
        gender,
        bio: '',
        role: 'user'
      }
    });

    // Create profile separately  
    await prisma.profile.create({
      data: {
        userId: user.id,
        photos: profileImage ? [profileImage] : [],
        religion: religion || null,
        caste: caste || null,
        location: location || null,
        occupation: null,
        education: null
      }
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
