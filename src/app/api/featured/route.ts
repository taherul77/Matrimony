import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/featured - Get featured profiles (Gold+ packages)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Find users with Gold+ packages (priority level 2 and above)
    const featuredProfiles = await prisma.profile.findMany({
      where: {
        user: {
          subscription: {
            isActive: true,
            package: {
              priorityLevel: {
                gte: 2 // Gold level and above
              }
            },
            endDate: {
              gt: new Date()
            }
          }
        }
      },
      include: {
        user: {
          include: {
            subscription: {
              include: {
                package: true
              }
            }
          }
        }
      },
      take: limit,
      orderBy: [
        { user: { subscription: { package: { priorityLevel: 'desc' } } } },
        { user: { createdAt: 'desc' } }
      ]
    });

    // Format the response
    const result = featuredProfiles.map((profile: any) => {
      const subscription = profile.user?.subscription;
      const packageInfo = subscription?.package;

      return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user?.name,
        age: profile.user?.age,
        gender: profile.user?.gender,
        bio: profile.user?.bio,
        photos: profile.photos || [],
        location: profile.location,
        occupation: profile.occupation,
        education: profile.education,
        religion: profile.religion,
        
        // Package highlights
        packageName: packageInfo?.name || 'Free',
        priorityLevel: packageInfo?.priorityLevel || 0,
        hasVipBadge: packageInfo?.hasVipBadge || false,
        hasProfileHighlight: packageInfo?.hasProfileHighlight || false,
        isFeatured: true
      };
    });

    return NextResponse.json({
      profiles: result,
      total: result.length
    });

  } catch (error) {
    console.error('Error fetching featured profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured profiles' },
      { status: 500 }
    );
  }
}
