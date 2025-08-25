import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { Profile } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users/profiles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Get token from cookies (for API routes, cookies are in headers)
    let token = "";
    if ("headers" in request && typeof request.headers.get === "function") {
      const cookie = request.headers.get("cookie");
      if (cookie) {
        const match = cookie.match(/token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    let userId = null;
    let preferences = null;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        ) as any;
        userId = decoded.userId;
        // Fetch preferences for the logged-in user
        preferences = await prisma.userPreference.findUnique({
          where: { userId },
        });
      } catch (err) {
        // ignore
      }
    }

    // Fetch all users with their profiles
    const users = await prisma.user.findMany({
      include: { profile: true },
      skip,
      take: limit,
    });

    // Calculate match percentage based on preferences
    function calcMatchPercentage(profile: any, preferences: any) {
      if (!preferences) return 0;
      let total = 0;
      let matched = 0;
      // Only count non-empty preference fields for total, and match only if preference is set
      const fields = [
        { key: 'minAge', match: () => profile.age !== undefined && (!preferences.minAge || profile.age >= preferences.minAge) },
        { key: 'maxAge', match: () => profile.age !== undefined && (!preferences.maxAge || profile.age <= preferences.maxAge) },
        { key: 'gender', match: () => profile.gender !== undefined && profile.gender === preferences.gender },
        { key: 'religion', match: () => profile.religion && profile.religion.toLowerCase() === preferences.religion.toLowerCase() },
        { key: 'caste', match: () => profile.caste && profile.caste.toLowerCase() === preferences.caste.toLowerCase() },
        { key: 'location', match: () => profile.location && profile.location.toLowerCase().includes(preferences.location.toLowerCase()) },
        { key: 'maritalStatus', match: () => profile.maritalStatus && profile.maritalStatus.toLowerCase() === preferences.maritalStatus.toLowerCase() },
        { key: 'minHeight', match: () => profile.minHeight !== undefined && (!preferences.minHeight || profile.minHeight >= preferences.minHeight) },
        { key: 'maxHeight', match: () => profile.maxHeight !== undefined && (!preferences.maxHeight || profile.maxHeight <= preferences.maxHeight) },
        { key: 'education', match: () => profile.education && profile.education.toLowerCase().includes(preferences.education.toLowerCase()) },
        { key: 'occupation', match: () => profile.occupation && profile.occupation.toLowerCase().includes(preferences.occupation.toLowerCase()) },
        { key: 'minIncome', match: () => profile.minIncome !== undefined && (!preferences.minIncome || profile.minIncome >= preferences.minIncome) },
        { key: 'maxIncome', match: () => profile.maxIncome !== undefined && (!preferences.maxIncome || profile.maxIncome <= preferences.maxIncome) },
        { key: 'lifestyle', match: () => profile.lifestyle && profile.lifestyle.toLowerCase().includes(preferences.lifestyle.toLowerCase()) },
        { key: 'languages', match: () => Array.isArray(profile.languages) && Array.isArray(preferences.languages) && profile.languages.some((lang: string) => preferences.languages.includes(lang)) },
        { key: 'country', match: () => profile.country && profile.country.toLowerCase() === preferences.country.toLowerCase() },
      ];

      for (const field of fields) {
        if (preferences[field.key] !== undefined && preferences[field.key] !== null && preferences[field.key] !== "") {
          total++;
          if (field.match()) matched++;
        }
      }

      // Add any additional fields from preferences
      for (const key in preferences) {
        if (fields.some(f => f.key === key)) continue; // already handled above
        if (preferences[key] !== undefined && preferences[key] !== null && preferences[key] !== "") {
          total++;
          if (profile[key] !== undefined && profile[key] !== null) {
            if (typeof preferences[key] === 'string' && typeof profile[key] === 'string') {
              if (profile[key].toLowerCase() === preferences[key].toLowerCase()) matched++;
            } else if (typeof preferences[key] === 'number' && typeof profile[key] === 'number') {
              if (profile[key] === preferences[key]) matched++;
            } else if (Array.isArray(preferences[key]) && Array.isArray(profile[key])) {
              if (profile[key].some((v: any) => preferences[key].includes(v))) matched++;
            } else if (profile[key] === preferences[key]) {
              matched++;
            }
          }
        }
      }
      if (total === 0) return 0;
      return Math.round((matched / total) * 100);
    }

    // Filter by religion and gender if set in preferences
    let filteredUsers = users;
    if (preferences) {
      if (preferences.religion) {
        const prefReligion = preferences.religion ? preferences.religion.toLowerCase() : null;
        filteredUsers = filteredUsers.filter((user: any) => {
          const userReligion = user.profile?.religion || user.religion;
          return userReligion && prefReligion && userReligion.toLowerCase() === prefReligion;
        });
      }
      if (preferences.gender) {
        filteredUsers = filteredUsers.filter((user: any) => user.gender === preferences.gender);
      }
    }
    // Use profile.id as key, but always include userId for linking
    const profiles: any[] = filteredUsers.map((user: any) => {
      const profile: Profile | null = user.profile;
      const flatProfile = {
        id: profile?.id || user.id, 
        userId: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        email: user.email,
        photos: profile?.photos || [],
        phone: profile?.phone || null,
        religion: profile?.religion || null,
        caste: profile?.caste || null,
        location: profile?.location || null,
        occupation: profile?.occupation || null,
        education: profile?.education || null,
        maritalStatus: profile?.maritalStatus || null,
        minHeight: profile?.minHeight || null,
        maxHeight: profile?.maxHeight || null,
        minIncome: profile?.minIncome || null,
        maxIncome: profile?.maxIncome || null,
        lifestyle: profile?.lifestyle || null,
        languages: profile?.languages || [],
        country: profile?.country || null
      };
      return {
        ...flatProfile,
        matchPercentage: calcMatchPercentage(flatProfile, preferences)
      };
    });

    return NextResponse.json({
      profiles: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
