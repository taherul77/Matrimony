import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get messages between two users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');
    
    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "Both user IDs required" }, { status: 400 });
    }

    // Find the chat room between these users
    const sortedUserIds = [userId, otherUserId].sort();
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { user1Id: sortedUserIds[0] },
          { user2Id: sortedUserIds[1] }
        ]
      }
    });

    if (!chatRoom) {
      // No chat room exists yet, return empty messages
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: chatRoom.id
      },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true }
        },
        receiver: {
          select: { id: true, name: true, profileImage: true }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Send a message (simplified version without subscription checks)
export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content } = await request.json();
    
    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: "Sender ID, receiver ID, and content required" }, { status: 400 });
    }

    // Check if sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true }
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true }
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Find or create chat room
    const sortedUserIds = [senderId, receiverId].sort();
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { user1Id: sortedUserIds[0] },
          { user2Id: sortedUserIds[1] }
        ]
      }
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          user1Id: sortedUserIds[0],
          user2Id: sortedUserIds[1]
        }
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatRoomId: chatRoom.id,
        senderId,
        receiverId,
        content
      },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true }
        },
        receiver: {
          select: { id: true, name: true, profileImage: true }
        }
      }
    });

    // Update chat room with last message info
    await prisma.chatRoom.update({
      where: { id: chatRoom.id },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}