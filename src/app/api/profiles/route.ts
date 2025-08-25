import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Profile } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users/profiles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Fetch all users with their profiles (no match/search logic)
    const users = await prisma.user.findMany({
      include: { profile: true },
      skip,
      take: limit,
    });

    // Use profile.id as key, but always include userId for linking
    const profiles: any[] = users.map((user: any) => {
      const profile: Profile | null = user.profile;
      return {
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
