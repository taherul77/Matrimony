import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { 
      userId,
      ageRange,
      gender,
      location,
      religion,
      education,
      occupation,
      maritalStatus,
      heightRange,
      incomeRange
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get user's subscription level for search priority
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { package: true }
        }
      }
    });

    const userPriorityLevel = currentUser?.subscription?.package?.priorityLevel || 0;

    // Build search filters
    const filters: any = {
      id: { not: userId }, // Exclude current user
      AND: []
    };

    if (gender) filters.AND.push({ gender });
    if (ageRange) {
      filters.AND.push({
        age: {
          gte: ageRange.min,
          lte: ageRange.max
        }
      });
    }

    // Profile filters
    const profileFilters: any = {};
    if (location) profileFilters.location = { contains: location };
    if (religion) profileFilters.religion = religion;
    if (education) profileFilters.education = { contains: education };
    if (occupation) profileFilters.occupation = { contains: occupation };
    if (maritalStatus) profileFilters.maritalStatus = maritalStatus;
    
    if (heightRange) {
      profileFilters.minHeight = { gte: heightRange.min };
      profileFilters.maxHeight = { lte: heightRange.max };
    }
    
    if (incomeRange) {
      profileFilters.minIncome = { gte: incomeRange.min };
      profileFilters.maxIncome = { lte: incomeRange.max };
    }

    if (Object.keys(profileFilters).length > 0) {
      filters.AND.push({ profile: profileFilters });
    }

    // Get all matching profiles
    const profiles = await prisma.user.findMany({
      where: filters,
      include: {
        profile: true,
        subscription: {
          include: { package: true }
        }
      }
    });

    // Sort by priority level (higher subscription levels appear first)
    const sortedProfiles = profiles.sort((a, b) => {
      const aPriority = a.subscription?.package?.priorityLevel || 0;
      const bPriority = b.subscription?.package?.priorityLevel || 0;
      return bPriority - aPriority;
    });

    // Apply limits based on user's subscription
    let limitedProfiles = sortedProfiles;
    if (userPriorityLevel === 0) { // Free users
      limitedProfiles = sortedProfiles.slice(0, 20); // Limited results
    } else if (userPriorityLevel === 1) { // Silver
      limitedProfiles = sortedProfiles.slice(0, 50);
    }
    // Gold, Platinum, VIP get unlimited results

    // Filter out sensitive information based on subscription level
    const filteredProfiles = limitedProfiles.map(profile => {
      const canViewContacts = currentUser?.subscription?.package?.canViewContacts || false;
      
      return {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        profileImage: profile.profileImage,
        bio: profile.bio,
        profile: {
          ...profile.profile,
          phone: canViewContacts ? profile.profile?.phone : 
                  profile.profile?.phone ? profile.profile.phone.substring(0, 5) + "***" : null
        },
        subscription: {
          package: {
            name: profile.subscription?.package?.name || "Free",
            priorityLevel: profile.subscription?.package?.priorityLevel || 0
          }
        }
      };
    });

    return NextResponse.json({ 
      profiles: filteredProfiles,
      totalFound: profiles.length,
      showing: filteredProfiles.length
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search profiles" }, { status: 500 });
  }
}
