import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name
        }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@matrimony.com',
        password: hashedPassword,
        name: 'Admin User',
        age: 35,
        gender: 'male',
        role: 'admin',
        bio: 'Platform administrator',
        profile: {
          create: {
            photos: [],
            religion: 'Other',
            caste: 'Other',
            location: 'Mumbai, Maharashtra',
            occupation: 'Administrator',
            education: 'MBA'
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      admin
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
