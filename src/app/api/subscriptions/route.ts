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
      console.error("Session parsing error:", error);
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

    console.log("Creating subscription for user:", userId, "package:", packageId);

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

    console.log("Subscription dates:", { startDate, endDate });

    // Check for existing subscription and delete it first to avoid unique constraint
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: userId }
    });

    if (existingSubscription) {
      console.log("Deleting existing subscription:", existingSubscription.id);
      await prisma.subscription.delete({
        where: { userId: userId }
      });
    }

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

    console.log("Subscription created successfully:", subscription.id);

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error("Subscription error:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json({ 
      error: "Failed to create subscription", 
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
