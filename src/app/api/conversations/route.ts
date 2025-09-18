import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Get user's conversations
export async function GET() {
  try {
    // Get user from authentication
    const cookieStore = await cookies();
    let userId = null;

    // Check for JWT token first
    const token = cookieStore.get('token');
    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'fallback-secret') as any;
        userId = decoded.userId;
      } catch (jwtError) {
        console.log('JWT verification failed, checking user cookie');
      }
    }

    // Fallback to user cookie if JWT fails
    if (!userId) {
      const userCookie = cookieStore.get('user');
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie.value);
          userId = userData.id;
        } catch (parseError) {
          console.log('Failed to parse user cookie');
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get chat rooms where the user is a participant
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get user details and last messages for each chat room
    const conversations = await Promise.all(
      chatRooms.map(async (room) => {
        // Get the other user's ID
        const otherUserId = room.user1Id === userId ? room.user2Id : room.user1Id;

        // Get other user details
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, name: true, profileImage: true }
        });

        // Get last message in this chat room
        const lastMessage = await prisma.message.findFirst({
          where: { chatRoomId: room.id },
          orderBy: { timestamp: 'desc' },
          include: {
            sender: {
              select: { name: true }
            }
          }
        });

        return {
          userId: otherUser?.id || otherUserId,
          userName: otherUser?.name || 'Unknown User',
          userImage: otherUser?.profileImage,
          lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
          timestamp: lastMessage ? 
            new Date(lastMessage.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : '',
          chatRoomId: room.id
        };
      })
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}