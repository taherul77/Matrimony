import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get current user subscription
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
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

    return NextResponse.json({ subscription: user.subscription });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// Subscribe to a package
export async function POST(req: Request) {
  try {
    const { userId, packageId } = await req.json();
    
    if (!userId || !packageId) {
      return NextResponse.json({ error: "User ID and Package ID required" }, { status: 400 });
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
