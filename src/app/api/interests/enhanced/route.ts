import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Send interest with daily limit check
export async function POST(req: Request) {
  try {
    const { senderId, receiverId, message } = await req.json();
    
    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Sender ID and receiver ID required" }, { status: 400 });
    }

    // Get sender's subscription details
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

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyLimit = await prisma.dailyLimit.findUnique({
      where: {
        userId_date: {
          userId: senderId,
          date: today
        }
      }
    });

    if (!dailyLimit) {
      dailyLimit = await prisma.dailyLimit.create({
        data: {
          userId: senderId,
          date: today,
          interestsSent: 0
        }
      });
    }

    const maxInterests = sender.subscription?.package?.maxInterests || 2;
    
    if (dailyLimit.interestsSent >= maxInterests) {
      return NextResponse.json({ 
        error: `Daily limit reached. You can send ${maxInterests} interests per day.` 
      }, { status: 429 });
    }

    // Check if interest already sent
    const existingInterest = await prisma.interest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId
        }
      }
    });

    if (existingInterest) {
      return NextResponse.json({ error: "Interest already sent to this user" }, { status: 400 });
    }

    // Create interest
    const interest = await prisma.interest.create({
      data: {
        senderId,
        receiverId,
        message: message || ""
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

    // Update daily limit
    await prisma.dailyLimit.update({
      where: { id: dailyLimit.id },
      data: { interestsSent: { increment: 1 } }
    });

    return NextResponse.json({ interest });
  } catch (error) {
    console.error("Interest error:", error);
    return NextResponse.json({ error: "Failed to send interest" }, { status: 500 });
  }
}

// Get interests for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'sent' or 'received'
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const whereClause = type === 'sent' 
      ? { senderId: userId }
      : { receiverId: userId };

    const interests = await prisma.interest.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { 
            id: true, 
            name: true, 
            profileImage: true,
            profile: {
              select: {
                photos: true,
                location: true,
                occupation: true,
                education: true
              }
            }
          }
        },
        receiver: {
          select: { 
            id: true, 
            name: true, 
            profileImage: true,
            profile: {
              select: {
                photos: true,
                location: true,
                occupation: true,
                education: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ interests });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}
