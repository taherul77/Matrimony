import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/debug/subscription - Debug subscription data
export async function GET(request: Request) {
  try {
    // Get user from cookies
    const cookies = request.headers.get('cookie');
    const userCookie = cookies?.split(';')
      .find(c => c.trim().startsWith('user='))
      ?.split('=')[1];

    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let currentUser;
    try {
      currentUser = JSON.parse(decodeURIComponent(userCookie));
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!currentUser?.id) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const userId = currentUser.id;

    // Get user with subscription details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            package: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all subscriptions for this user (for debugging)
    const allSubscriptions = await prisma.subscription.findMany({
      where: { userId: userId },
      include: {
        package: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      currentSubscription: user.subscription,
      allSubscriptions: allSubscriptions,
      subscriptionCount: allSubscriptions.length
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Failed to get debug info' }, { status: 500 });
  }
}
