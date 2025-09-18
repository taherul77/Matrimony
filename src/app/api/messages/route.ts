import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get messages between two users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');
    
    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "Both user IDs required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
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
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Send a message
export async function POST(req: Request) {
  try {
    const { senderId, receiverId, content } = await req.json();
    
    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: "Sender ID, receiver ID, and content required" }, { status: 400 });
    }

    // Check if sender has messaging privileges
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      include: {
        subscription: {
          include: { package: true }
        }
      }
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Check messaging permissions based on subscription
    if (!sender.subscription?.package?.canMessage && sender.subscription?.package?.name !== "Free") {
      return NextResponse.json({ error: "Upgrade your plan to send messages" }, { status: 403 });
    }

    // For free users, check if receiver is premium
    if (sender.subscription?.package?.name === "Free") {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        include: {
          subscription: {
            include: { package: true }
          }
        }
      });

      if (!receiver?.subscription || receiver.subscription.package.name === "Free") {
        return NextResponse.json({ 
          error: "Free users can only receive messages from Premium members" 
        }, { status: 403 });
      }
    }

    // Find or create chat room
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId,
          lastMessage: content,
          lastMessageAt: new Date()
        }
      });
    } else {
      // Update last message info
      await prisma.chatRoom.update({
        where: { id: chatRoom.id },
        data: {
          lastMessage: content,
          lastMessageAt: new Date(),
          // Increment unread count for the receiver
          ...(chatRoom.user1Id === receiverId 
            ? { unreadCount1: { increment: 1 } }
            : { unreadCount2: { increment: 1 } }
          )
        }
      });
    }

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

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
