// Search API: returns profiles based on search filters (not match percentage)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build dynamic where object
    const where: any = {};
    if (searchParams.get("location")) where.location = { contains: searchParams.get("location"), mode: "insensitive" };
    if (searchParams.get("religion")) where.religion = { contains: searchParams.get("religion"), mode: "insensitive" };
    if (searchParams.get("caste")) where.caste = { contains: searchParams.get("caste"), mode: "insensitive" };
    if (searchParams.get("education")) where.education = { contains: searchParams.get("education"), mode: "insensitive" };
    if (searchParams.get("occupation")) where.occupation = { contains: searchParams.get("occupation"), mode: "insensitive" };
    if (searchParams.get("maritalStatus")) where.maritalStatus = { contains: searchParams.get("maritalStatus"), mode: "insensitive" };
    if (searchParams.get("lifestyle")) where.lifestyle = { contains: searchParams.get("lifestyle"), mode: "insensitive" };
    if (searchParams.get("country")) where.country = { contains: searchParams.get("country"), mode: "insensitive" };
    if (searchParams.get("languages")) where.languages = { has: searchParams.get("languages") };
    if (searchParams.get("gender")) where.gender = searchParams.get("gender");
    // Keyword search (searches multiple fields, including user.name)
    if (searchParams.get("keyword")) {
      const keyword = searchParams.get("keyword") || "";
      where.OR = [
        // Profile fields
        { location: { contains: keyword, mode: "insensitive" } },
        { occupation: { contains: keyword, mode: "insensitive" } },
        { education: { contains: keyword, mode: "insensitive" } },
        { caste: { contains: keyword, mode: "insensitive" } },
        { religion: { contains: keyword, mode: "insensitive" } },
        { maritalStatus: { contains: keyword, mode: "insensitive" } },
        { lifestyle: { contains: keyword, mode: "insensitive" } },
        { country: { contains: keyword, mode: "insensitive" } },
        { languages: { has: keyword } },
        { phone: { contains: keyword, mode: "insensitive" } },
        { photos: { has: keyword } },
        // User fields
        { user: { name: { contains: keyword, mode: "insensitive" } } },
        { user: { email: { contains: keyword, mode: "insensitive" } } },
        { user: { gender: { contains: keyword, mode: "insensitive" } } },
        { user: { bio: { contains: keyword, mode: "insensitive" } } },
        { user: { phone: { contains: keyword, mode: "insensitive" } } },
        { user: { profileImage: { contains: keyword, mode: "insensitive" } } },
        { user: { role: { contains: keyword, mode: "insensitive" } } },
        // Numeric fields as string match
        { minHeight: { equals: parseFloat(keyword) || undefined } },
        { maxHeight: { equals: parseFloat(keyword) || undefined } },
        { minIncome: { equals: parseInt(keyword) || undefined } },
        { maxIncome: { equals: parseInt(keyword) || undefined } },
        { user: { age: { equals: parseInt(keyword) || undefined } } },
      ];
    }
    // Age filter (if you want to support it)
    if (searchParams.get("ageFrom") || searchParams.get("ageTo")) {
      where.AND = [];
      if (searchParams.get("ageFrom")) where.AND.push({ age: { gte: parseInt(searchParams.get("ageFrom")!) } });
      if (searchParams.get("ageTo")) where.AND.push({ age: { lte: parseInt(searchParams.get("ageTo")!) } });
    }

    const profiles = await prisma.profile.findMany({
      where,
      skip,
      take: limit,
      include: { user: true },
    });

    // Flatten user info into each profile
    const result = profiles.map((profile: any) => ({
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
    }));
    return NextResponse.json({ profiles: result });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
