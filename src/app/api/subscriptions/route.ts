import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// Get current user subscription
export async function GET(req: Request) {
  try {
    // Get user from session cookies
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let currentUser;
    try {
      currentUser = JSON.parse(userCookie.value);
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = currentUser.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

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

    return NextResponse.json({ 
      subscription: user.subscription,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// Subscribe to a package
export async function POST(req: Request) {
  try {
    // Get user from session cookies
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let currentUser;
    try {
      currentUser = JSON.parse(userCookie.value);
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = currentUser.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const { packageId } = await req.json();
    
    if (!packageId) {
      return NextResponse.json({ error: "Package ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (packageData.duration * 24 * 60 * 60 * 1000));

    // Deactivate existing subscription
    await prisma.subscription.updateMany({
      where: { userId: userId },
      data: { isActive: false }
    });

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: userId,
        packageId: packageId,
        startDate: startDate,
        endDate: endDate,
        amount: packageData.price,
        paymentStatus: "completed"
      },
      include: {
        package: true
      }
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
