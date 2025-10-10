import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runEnhancedSearch(params: any) {
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
  } = params;

  // If userId is provided, fetch the user's subscription for priority; otherwise operate in public mode
  let currentUser: any = null;
  let userPriorityLevel = 0;
  if (userId) {
    currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { package: true }
        }
      }
    });
    userPriorityLevel = currentUser?.subscription?.package?.priorityLevel || 0;
  }

  // Build search filters
  const filters: any = {
    // id: { not: userId }, // Temporarily removed for debugging - was excluding current user
    AND: []
  };

  if (gender) filters.AND.push({ gender });
  
  // Only apply age filter if we have a valid age range
  if (ageRange && ageRange.min > 0 && ageRange.max > 0 && ageRange.min <= ageRange.max) {
    filters.AND.push({
      age: {
        gte: ageRange.min,
        lte: ageRange.max
      }
    });
  }

  // Profile filters - build them separately to avoid conflicts
  const profileFilters: any = {};
  
  // Add non-location filters first
  if (religion) profileFilters.religion = religion;
  if (education) profileFilters.education = { contains: education };
  if (occupation) profileFilters.occupation = { contains: occupation };
  if (maritalStatus) profileFilters.maritalStatus = maritalStatus;

  // Add location filter with word-based matching
  if (location) {
    const locationWords = location.trim().split(/\s+/).filter((word: string) => word.length > 0);
    if (locationWords.length > 0) {
      // Create OR conditions for each word in the location search
      const locationOrConditions = locationWords.map((word: string) => ({
        location: { contains: word, mode: 'insensitive' }
      }));
      
      if (Object.keys(profileFilters).length > 0) {
        // If we have other profile filters, combine them with location OR
        filters.AND.push({ 
          profile: {
            ...profileFilters,
            OR: locationOrConditions
          }
        });
      } else {
        // If only location filter, use it directly
        filters.AND.push({ 
          profile: {
            OR: locationOrConditions
          }
        });
      }
    } else if (Object.keys(profileFilters).length > 0) {
      // No location but other profile filters
      filters.AND.push({ profile: profileFilters });
    }
  } else if (Object.keys(profileFilters).length > 0) {
    // No location filter, just other profile filters
    filters.AND.push({ profile: profileFilters });
  }

  // Don't add height/income filters if they're at default/maximum values since most profiles have null
  const isDefaultHeightRange = heightRange && heightRange.min <= 150 && heightRange.max >= 180;
  const isDefaultIncomeRange = incomeRange && incomeRange.min <= 0 && incomeRange.max >= 2000000;

  // Handle height and income filters separately to avoid OR conflicts
  if (!isDefaultHeightRange && heightRange) {
    filters.AND.push({
      OR: [
        { profile: null }, // Users without profiles
        { profile: { minHeight: null } }, // Profiles without height data
        { profile: { minHeight: { gte: heightRange.min } } }
      ]
    });
  }

  if (!isDefaultIncomeRange && incomeRange) {
    filters.AND.push({
      OR: [
        { profile: null }, // Users without profiles
        { profile: { minIncome: null } }, // Profiles without income data  
        { profile: { minIncome: { gte: incomeRange.min } } }
      ]
    });
  }

  // Debug log of constructed filters
  console.debug('[enhanced/search] userId=', userId, 'filters=', JSON.stringify(filters));
  // Get all matching profiles
  // Get a count first for debugging
  try {
    const cnt = await prisma.user.count({ where: filters });
    console.debug('[enhanced/search] prisma.user.count=', cnt);
  } catch (err) {
    const e: any = err;
    console.debug('[enhanced/search] count error', e?.message || e);
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

  // Apply limits based on user's subscription (if in public mode, apply default limits)
  let limitedProfiles = sortedProfiles;
  const effectivePriority = userPriorityLevel || 0;
  if (!userId) {
    // Public mode: apply conservative limit
    limitedProfiles = sortedProfiles.slice(0, 20);
  } else if (effectivePriority === 0) { // Free users
    limitedProfiles = sortedProfiles.slice(0, 20); // Limited results
  } else if (effectivePriority === 1) { // Silver
    limitedProfiles = sortedProfiles.slice(0, 50);
  }

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

  console.debug('[enhanced/search] matched=', profiles.length, 'returning=', filteredProfiles.length);

  return { status: 200, body: { profiles: filteredProfiles, totalFound: profiles.length, showing: filteredProfiles.length } };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await runEnhancedSearch(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search profiles" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Read possible params: userId, ageFrom, ageTo, gender, location, religion, education, occupation, maritalStatus
    const userId = searchParams.get('userId');
    const ageFrom = searchParams.get('ageFrom');
    const ageTo = searchParams.get('ageTo');
    const gender = searchParams.get('gender') || undefined;
    const location = searchParams.get('location') || undefined;
    const religion = searchParams.get('religion') || undefined;
    const education = searchParams.get('education') || undefined;
    const occupation = searchParams.get('occupation') || undefined;
    const maritalStatus = searchParams.get('maritalStatus') || undefined;

    const ageRange = ageFrom || ageTo ? { min: ageFrom ? parseInt(ageFrom) : 0, max: ageTo ? parseInt(ageTo) : 200 } : undefined;

    const params: any = { userId, ageRange, gender, location, religion, education, occupation, maritalStatus };

    // If userId is missing, return 400 to indicate requirement for enhanced POST; but allow GET for debugging if userId provided
    if (!userId) {
      // For convenience, allow public-like searches via GET when userId is not provided by delegating to public /api/search
      return NextResponse.json({ error: 'userId query param missing; use POST /api/search/enhanced with JSON body for full enhanced search' }, { status: 400 });
    }

    const result = await runEnhancedSearch(params);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('Enhanced GET error:', error);
    return NextResponse.json({ error: 'Failed to perform enhanced search' }, { status: 500 });
  }
}
