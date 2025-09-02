import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { checkUserLimit, incrementUserUsage } from '@/lib/permissions';

const prisma = new PrismaClient();

// Get all interests (for admin) or user's interests
export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let interests;

    if (user.role === 'admin') {
      // Admin can see all interests
      interests = await prisma.interest.findMany({
        include: {
          sender: {
            select: { id: true, name: true, email: true }
          },
          receiver: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Regular users see their own interests (sent and received)
      interests = await prisma.interest.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true }
          },
          receiver: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(interests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

// Send interest
export async function POST(request: Request) {
  try {
    const { receiverId, message } = await request.json();
    
    // Get token from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const senderId = decoded.userId;

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Sender ID and Receiver ID are required' },
        { status: 400 }
      );
    }

    // Check user's interest limit
    const limitCheck = await checkUserLimit(senderId, 'interests');
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { 
          error: limitCheck.message || 'Interest limit reached',
          current: limitCheck.current,
          limit: limitCheck.limit
        },
        { status: 403 }
      );
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findFirst({
      where: {
        senderId,
        receiverId
      }
    });

    if (existingInterest) {
      return NextResponse.json(
        { error: 'Interest already sent to this user' },
        { status: 400 }
      );
    }

    // Create new interest
    const interest = await prisma.interest.create({
      data: {
        senderId,
        receiverId,
        message: message || '',
        status: 'pending'
      }
    });

    // Increment user's interest usage
    await incrementUserUsage(senderId, 'interests');

    // Create notification for receiver (will be enabled after Prisma regeneration)
    try {
      // await prisma.notification.create({
      //   data: {
      //     userId: receiverId,
      //     type: 'interest_received',
      //     title: 'New Interest Received',
      //     content: `Someone is interested in your profile`,
      //     data: JSON.stringify({ senderId, interestId: interest.id })
      //   }
      // });
    } catch (error) {
      console.log("Notification creation temporarily disabled");
    }

    // Fetch sender and receiver for response
    const sender = await prisma.user.findUnique({ 
      where: { id: senderId }, 
      select: { id: true, name: true, email: true } 
    });
    const receiver = await prisma.user.findUnique({ 
      where: { id: receiverId }, 
      select: { id: true, name: true, email: true } 
    });

    return NextResponse.json({
      message: 'Interest sent successfully',
      data: {
        ...interest,
        sender,
        receiver
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending interest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
