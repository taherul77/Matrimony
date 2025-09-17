import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET /api/chat/rooms - Get all chat rooms for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get all chat rooms where user is participant
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Get user details for each chat room
    const chatRoomsWithUsers = await Promise.all(
      chatRooms.map(async (room) => {
        const otherUserId = room.user1Id === userId ? room.user2Id : room.user1Id;
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            name: true,
            profileImage: true,
            isOnline: true,
            lastSeen: true
          }
        });

        const unreadCount = room.user1Id === userId ? room.unreadCount1 : room.unreadCount2;

        return {
          ...room,
          otherUser,
          unreadCount,
          lastMessage: room.messages[0] || null
        };
      })
    );

    return NextResponse.json({ chatRooms: chatRoomsWithUsers });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 });
  }
}

// POST /api/chat/rooms - Create or get existing chat room
export async function POST(request: NextRequest) {
  try {
    const { user1Id, user2Id } = await request.json();

    if (!user1Id || !user2Id) {
      return NextResponse.json({ error: 'Both user IDs required' }, { status: 400 });
    }

    // Check if chat room already exists (bidirectional)
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { user1Id: user1Id, user2Id: user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    });

    // Create new chat room if doesn't exist
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          user1Id,
          user2Id
        }
      });
    }

    return NextResponse.json({ chatRoom });
  } catch (error) {
    console.error('Error creating/fetching chat room:', error);
    return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 });
  }
}