import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Track profile visit
export async function POST(req: Request) {
  try {
    const { visitorId, visitedId } = await req.json();
    
    if (!visitorId || !visitedId) {
      return NextResponse.json({ error: "Visitor ID and visited ID required" }, { status: 400 });
    }

    if (visitorId === visitedId) {
      return NextResponse.json({ message: "Cannot track self visits" }, { status: 200 });
    }

    // Check if already visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVisit = await prisma.profileVisit.findFirst({
      where: {
        visitorId,
        visitedId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (!existingVisit) {
      await prisma.profileVisit.create({
        data: {
          visitorId,
          visitedId
        }
      });
    }

    return NextResponse.json({ message: "Visit tracked" });
  } catch (error) {
    console.error("Profile visit error:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}

// Get profile visitors (Premium feature)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if user has premium subscription to view visitors
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { package: true }
        }
      }
    });

    if (!user?.subscription || user.subscription.package.priorityLevel < 3) {
      return NextResponse.json({ 
        error: "Upgrade to Platinum or higher to see who visited your profile" 
      }, { status: 403 });
    }

    const visitors = await prisma.profileVisit.findMany({
      where: { visitedId: userId },
      include: {
        visitor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            age: true,
            profile: {
              select: {
                photos: true,
                location: true,
                occupation: true
              }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return NextResponse.json({ visitors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 });
  }
}
