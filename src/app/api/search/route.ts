// Search API: returns profiles based on search filters with package-based ordering
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { getUserPermissions } from '@/lib/permissions';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Get requesting user's permissions
    let userPermissions = null;
    let userId = null;
    
    try {
      const cookies = request.headers.get('cookie');
      const token = cookies?.split(';')
        .find(c => c.trim().startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
        userPermissions = await getUserPermissions(userId);
      }
    } catch (error) {
      // Continue without permissions for unauthenticated users
    }

    // Build dynamic where object
    const where: any = {};
    
    // Basic filters (available to all users)
    if (searchParams.get("location")) where.location = { contains: searchParams.get("location"), mode: "insensitive" };
    if (searchParams.get("religion")) where.religion = { contains: searchParams.get("religion"), mode: "insensitive" };
    if (searchParams.get("gender")) where.gender = searchParams.get("gender");
    
    // Advanced filters (only for premium users)
    if (userPermissions?.hasAdvancedSearch) {
      if (searchParams.get("caste")) where.caste = { contains: searchParams.get("caste"), mode: "insensitive" };
      if (searchParams.get("education")) where.education = { contains: searchParams.get("education"), mode: "insensitive" };
      if (searchParams.get("occupation")) where.occupation = { contains: searchParams.get("occupation"), mode: "insensitive" };
      if (searchParams.get("maritalStatus")) where.maritalStatus = { contains: searchParams.get("maritalStatus"), mode: "insensitive" };
      if (searchParams.get("lifestyle")) where.lifestyle = { contains: searchParams.get("lifestyle"), mode: "insensitive" };
      if (searchParams.get("country")) where.country = { contains: searchParams.get("country"), mode: "insensitive" };
      if (searchParams.get("languages")) where.languages = { has: searchParams.get("languages") };
      
      // Income filters
      if (searchParams.get("minIncome")) where.minIncome = { gte: parseInt(searchParams.get("minIncome")!) };
      if (searchParams.get("maxIncome")) where.maxIncome = { lte: parseInt(searchParams.get("maxIncome")!) };
      
      // Height filters
      if (searchParams.get("minHeight")) where.minHeight = { gte: parseFloat(searchParams.get("minHeight")!) };
      if (searchParams.get("maxHeight")) where.maxHeight = { lte: parseFloat(searchParams.get("maxHeight")!) };
    }
    
    // Keyword search
    if (searchParams.get("keyword")) {
      const keyword = searchParams.get("keyword") || "";
      const keywordFilters: any[] = [
        { location: { contains: keyword, mode: "insensitive" } },
        { user: { name: { contains: keyword, mode: "insensitive" } } },
      ];
      
      // Add advanced keyword search for premium users
      if (userPermissions?.hasAdvancedSearch) {
        keywordFilters.push(
          { occupation: { contains: keyword, mode: "insensitive" } },
          { education: { contains: keyword, mode: "insensitive" } },
          { caste: { contains: keyword, mode: "insensitive" } },
          { religion: { contains: keyword, mode: "insensitive" } },
          { maritalStatus: { contains: keyword, mode: "insensitive" } },
          { lifestyle: { contains: keyword, mode: "insensitive" } },
          { country: { contains: keyword, mode: "insensitive" } }
        );
      }
      
      where.OR = keywordFilters;
    }
    
    // Age filter
    if (searchParams.get("ageFrom") || searchParams.get("ageTo")) {
      where.user = where.user || {};
      if (searchParams.get("ageFrom")) {
        where.user.age = { gte: parseInt(searchParams.get("ageFrom")!) };
      }
      if (searchParams.get("ageTo")) {
        where.user.age = { ...where.user.age, lte: parseInt(searchParams.get("ageTo")!) };
      }
    }

    const profiles = await prisma.profile.findMany({
      where,
      skip,
      take: limit,
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
      orderBy: [
        { user: { createdAt: 'desc' } }
      ]
    });

    // Sort by package priority and features
    const sortedProfiles = profiles.sort((a: any, b: any) => {
      const aPackage = a.user?.subscription?.package;
      const bPackage = b.user?.subscription?.package;
      const aPriority = aPackage?.priorityLevel || 0;
      const bPriority = bPackage?.priorityLevel || 0;
      
      // Featured profiles first
      const aFeatured = aPackage?.isFeatured || false;
      const bFeatured = bPackage?.isFeatured || false;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      
      // VIP badge second
      const aVip = aPackage?.hasVipBadge || false;
      const bVip = bPackage?.hasVipBadge || false;
      if (aVip && !bVip) return -1;
      if (!aVip && bVip) return 1;
      
      // Priority level third
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      return 0;
    });

    // Flatten user info into each profile with package-based features
    const result = sortedProfiles.map((profile: any) => {
      const subscription = profile.user?.subscription;
      const packageInfo = subscription?.package;
      const isActiveSubscription = subscription?.isActive && 
        subscription?.endDate && 
        new Date(subscription.endDate) > new Date();

      return {
        // User fields
        id: profile.id,
        userId: profile.userId,
        name: profile.user?.name || null,
        email: profile.user?.email || null,
        age: profile.user?.age || null,
        gender: profile.user?.gender || null,
        bio: profile.user?.bio || null,
        phone: profile.user?.phone || profile.phone || null,
        profileImage: profile.user?.profileImage || null,
        role: profile.user?.role || null,
        userCreatedAt: profile.user?.createdAt || null,
        userUpdatedAt: profile.user?.updatedAt || null,
        matchIds: profile.user?.matchIds || [],
        
        // Package features
        isVip: packageInfo?.hasVipBadge || false,
        isFeatured: packageInfo?.isFeatured || false,
        hasProfileHighlight: packageInfo?.hasProfileHighlight || false,
        priorityLevel: packageInfo?.priorityLevel || 0,
        packageName: packageInfo?.name || 'Free',
        
        // Profile fields
        photos: profile.photos || [],
        profilePhone: profile.phone || null,
        religion: profile.religion || null,
        caste: profile.caste || null,
        location: profile.location || null,
        occupation: profile.occupation || null,
        education: profile.education || null,
        maritalStatus: profile.maritalStatus || null,
        minHeight: profile.minHeight || null,
        maxHeight: profile.maxHeight || null,
        minIncome: profile.minIncome || null,
        maxIncome: profile.maxIncome || null,
        lifestyle: profile.lifestyle || null,
        languages: profile.languages || [],
        country: profile.country || null,
        profileCreatedAt: profile.createdAt || null,
        profileUpdatedAt: profile.updatedAt || null
      };
    });

    return NextResponse.json({ 
      profiles: result,
      meta: {
        userPermissions: userPermissions ? {
          hasAdvancedSearch: userPermissions.hasAdvancedSearch,
          canViewContacts: userPermissions.canViewContacts,
          canViewFullContacts: userPermissions.canViewFullContacts
        } : null,
        totalResults: result.length,
        page,
        limit
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
