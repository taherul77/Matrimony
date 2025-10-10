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
      const priorityLevel = packageInfo?.priorityLevel || 0;

      // Determine featured level based on priority level
      let featuredLevel = 'bronze';
      if (priorityLevel >= 4) featuredLevel = 'gold';
      else if (priorityLevel >= 3) featuredLevel = 'silver';

      return {
        id: profile.userId, // Use userId as profile id for frontend
        name: profile.user?.name || 'Anonymous',
        age: profile.user?.age || 0,
        location: profile.location || 'Location not specified',
        occupation: profile.occupation || 'Not specified',
        education: profile.education || 'Not specified',
        profileImage: profile.user?.profileImage || profile.photos?.[0] || '/uploads/default-avatar.jpg',
        isVerified: profile.user?.profileImage ? true : false, // Simple verification logic
        isPremium: priorityLevel >= 2, // Gold+ packages
        featuredLevel: featuredLevel as 'gold' | 'silver' | 'bronze',
        profileViews: Math.floor(Math.random() * 1000) + 100, // Placeholder - you can implement real view tracking
        successRate: Math.floor(Math.random() * 30) + 70, // Placeholder - you can implement real success rate calculation
        lastActive: profile.user?.lastSeen ? new Date(profile.user.lastSeen).toLocaleDateString() : 'recently',
        bio: profile.user?.bio || 'No bio available',
        
        // Package highlights
        packageName: packageInfo?.name || 'Free',
        priorityLevel: priorityLevel,
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
