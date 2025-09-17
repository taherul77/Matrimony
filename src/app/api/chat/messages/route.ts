import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPermissions, checkUserLimit } from '@/lib/permissions';
import { emitToRoom } from '@/lib/socket';

const prisma = new PrismaClient();

// GET /api/chat/messages - Get messages for a chat room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatRoomId = searchParams.get('chatRoomId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    if (!chatRoomId) {
      return NextResponse.json({ error: 'Chat room ID required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });

    return NextResponse.json({ 
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { chatRoomId, senderId, receiverId, content, messageType = 'text' } = await request.json();

    if (!chatRoomId || !senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check messaging permissions and limits
    const permissions = await getUserPermissions(senderId);
    const messageCheck = await checkUserLimit(senderId, 'messages');

    if (!permissions.canMessage) {
      return NextResponse.json({ 
        error: 'Messaging not available in your package',
        upgradeRequired: true
      }, { status: 403 });
    }

    if (!messageCheck.allowed) {
      return NextResponse.json({ 
        error: messageCheck.message,
        limitReached: true,
        current: messageCheck.current,
        limit: messageCheck.limit
      }, { status: 429 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        receiverId,
        content,
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });

    // Update chat room with last message info
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        // Increment unread count for receiver
        ...(senderId === (await prisma.chatRoom.findUnique({ where: { id: chatRoomId } }))?.user1Id 
          ? { unreadCount2: { increment: 1 } }
          : { unreadCount1: { increment: 1 } }
        )
      }
    });

    // Increment user's message usage
    await prisma.user.update({
      where: { id: senderId },
      data: { monthlyMessages: { increment: 1 } }
    });

    // Emit real-time message to Socket.IO clients
    try {
      emitToRoom(chatRoomId, 'message:received', {
        ...message,
        timestamp: message.timestamp.toISOString()
      });
      console.log('Message broadcasted via Socket.IO:', message.id);
    } catch (socketError) {
      console.error('Failed to broadcast message via Socket.IO:', socketError);
      // Continue execution even if Socket.IO fails
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// PATCH /api/chat/messages - Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const { chatRoomId, userId } = await request.json();

    if (!chatRoomId || !userId) {
      return NextResponse.json({ error: 'Chat room ID and user ID required' }, { status: 400 });
    }

    // Mark all unread messages as read
    await prisma.message.updateMany({
      where: {
        chatRoomId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    // Reset unread count in chat room
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId }
    });

    if (chatRoom) {
      await prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          ...(chatRoom.user1Id === userId 
            ? { unreadCount1: 0 }
            : { unreadCount2: 0 }
          )
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
}