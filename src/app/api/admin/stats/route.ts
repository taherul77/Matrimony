import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get basic user counts
    const totalUsers = await prisma.user.count();
    const maleUsers = await prisma.user.count({ where: { gender: "male" } });
    const femaleUsers = await prisma.user.count({ where: { gender: "female" } });

    // Get today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRegistrations = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get active subscriptions count
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        isActive: true,
        endDate: {
          gte: new Date()
        }
      }
    });

    // Calculate total revenue
    const subscriptions = await prisma.subscription.findMany({
      where: {
        paymentStatus: "completed"
      },
      select: {
        amount: true
      }
    });

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    // Get package distribution
    const packages = await prisma.package.findMany({
      include: {
        subscriptions: {
          where: {
            isActive: true
          }
        }
      }
    });

    const packageDistribution = packages.map(pkg => ({
      name: pkg.name,
      count: pkg.subscriptions.length,
      revenue: pkg.subscriptions.reduce((sum, sub) => sum + pkg.price, 0)
    }));

    // Add free users to package distribution
    const freeUsersCount = totalUsers - activeSubscriptions;
    packageDistribution.unshift({
      name: "Free",
      count: freeUsersCount,
      revenue: 0
    });

    // Get matches and interests count
    const totalMatches = await prisma.match.count({
      where: { status: "accepted" }
    });

    const totalInterests = await prisma.interest.count();

    const stats = {
      totalUsers,
      maleUsers,
      femaleUsers,
      todayRegistrations,
      activeSubscriptions,
      totalRevenue,
      packageDistribution,
      totalMatches,
      totalInterests
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
