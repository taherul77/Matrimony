import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Delete existing packages
    await prisma.package.deleteMany();

    const packages = [
      {
        name: "Free",
        price: 0,
        duration: 365,
        maxPhotos: 2,
        maxInterests: 3,
        monthlyMessages: 0,
        canMessage: false,
        canViewContacts: false,
        canViewFullContacts: false,
        priorityLevel: 0,
        hasVipBadge: false,
        isFeatured: false,
        hasAdvancedSearch: false,
        hasProfileHighlight: false,
        hasWeeklyBoost: false,
        hasDedicatedSupport: false,
        hasCompatibilityTools: false,
        canBrowsePrivately: false,
        canViewProfileVisitors: false,
        hasPersonalMatchmaker: false,
        hasHandpickedMatches: false,
        hasPrioritySupport: false,
        hasEventAccess: false,
        hasProfilePromotion: false,
        hasPrivacyControl: false,
        features: [
          "✅ Profile creation",
          "✅ Limited photo uploads (1–2 photos)",
          "✅ Basic search & browse profiles",
          "✅ Send limited interests per day (2–3)",
          "✅ Receive messages from Premium members only",
          "🚫 Cannot view contact details",
          "🚫 No direct messaging"
        ]
      },
      {
        name: "Silver",
        price: 500,
        duration: 160,
        maxPhotos: 5,
        maxInterests: 20,
        monthlyMessages: 10,
        canMessage: true,
        canViewContacts: true,
        canViewFullContacts: false,
        priorityLevel: 1,
        hasVipBadge: false,
        isFeatured: false,
        hasAdvancedSearch: false,
        hasProfileHighlight: false,
        hasWeeklyBoost: false,
        hasDedicatedSupport: false,
        hasCompatibilityTools: false,
        canBrowsePrivately: false,
        canViewProfileVisitors: false,
        hasPersonalMatchmaker: false,
        hasHandpickedMatches: false,
        hasPrioritySupport: false,
        hasEventAccess: false,
        hasProfilePromotion: false,
        hasPrivacyControl: false,
        features: [
          "💰 Affordable entry-level premium",
          "✅ All Free features",
          "✅ Upload up to 5 photos",
          "✅ Send up to 20 interests per day",
          "✅ Limited direct messaging (10 per month)",
          "✅ Basic contact details visible (phone/email partially masked)",
          "✅ Priority in search results (lower level)"
        ]
      },
      {
        name: "Gold",
        price: 1500,
        duration: 180,
        maxPhotos: -1,
        maxInterests: -1,
        monthlyMessages: -1,
        canMessage: true,
        canViewContacts: true,
        canViewFullContacts: true,
        priorityLevel: 2,
        hasVipBadge: false,
        isFeatured: true,
        hasAdvancedSearch: true,
        hasProfileHighlight: true,
        hasWeeklyBoost: false,
        hasDedicatedSupport: false,
        hasCompatibilityTools: false,
        canBrowsePrivately: false,
        canViewProfileVisitors: false,
        hasPersonalMatchmaker: false,
        hasHandpickedMatches: false,
        hasPrioritySupport: false,
        hasEventAccess: false,
        hasProfilePromotion: false,
        hasPrivacyControl: false,
        features: [
          "💰 Mid-range premium",
          "✅ All Silver features",
          "✅ Upload unlimited photos",
          "✅ Send unlimited interests",
          "✅ Unlimited direct messaging",
          "✅ View full contact details",
          "✅ Appear in Featured Profiles section",
          "✅ Advanced search filters (education, profession, income, etc.)",
          "✅ Profile highlighted for better visibility"
        ]
      },
      {
        name: "Platinum",
        price: 2500,
        duration: 200,
        maxPhotos: -1,
        maxInterests: -1,
        monthlyMessages: -1,
        canMessage: true,
        canViewContacts: true,
        canViewFullContacts: true,
        priorityLevel: 3,
        hasVipBadge: true,
        isFeatured: true,
        hasAdvancedSearch: true,
        hasProfileHighlight: true,
        hasWeeklyBoost: true,
        hasDedicatedSupport: true,
        hasCompatibilityTools: true,
        canBrowsePrivately: true,
        canViewProfileVisitors: true,
        hasPersonalMatchmaker: false,
        hasHandpickedMatches: false,
        hasPrioritySupport: false,
        hasEventAccess: false,
        hasProfilePromotion: false,
        hasPrivacyControl: true,
        features: [
          "💰 Higher premium tier",
          "✅ All Gold features",
          "✅ VIP badge on profile",
          "✅ Appear top in search results",
          "✅ Dedicated customer support",
          "✅ Profile boosted weekly for extra visibility",
          "✅ Access to horoscope/compatibility matching tools",
          "✅ Option to hide online status / browse privately",
          "✅ View who visited your profile"
        ]
      },
      {
        name: "VIP",
        price: 5000,
        duration: 365,
        maxPhotos: -1,
        maxInterests: -1,
        monthlyMessages: -1,
        canMessage: true,
        canViewContacts: true,
        canViewFullContacts: true,
        priorityLevel: 4,
        hasVipBadge: true,
        isFeatured: true,
        hasAdvancedSearch: true,
        hasProfileHighlight: true,
        hasWeeklyBoost: true,
        hasDedicatedSupport: true,
        hasCompatibilityTools: true,
        canBrowsePrivately: true,
        canViewProfileVisitors: true,
        hasPersonalMatchmaker: true,
        hasHandpickedMatches: true,
        hasPrioritySupport: true,
        hasEventAccess: true,
        hasProfilePromotion: true,
        hasPrivacyControl: true,
        features: [
          "💰 Premium exclusive tier",
          "✅ All Platinum features",
          "✅ Dedicated relationship manager / personal matchmaker",
          "✅ Handpicked matches sent directly",
          "✅ Priority support (24/7 helpline)",
          "✅ Confidential & discreet profile handling",
          "✅ Invitations to exclusive matchmaking events / webinars",
          "✅ Profile promoted across platform newsletters & ads",
          "✅ Complete privacy control"
        ]
      }
    ];

    const createdPackages = await Promise.all(
      packages.map(pkg => prisma.package.create({ data: pkg }))
    );

    return NextResponse.json({ 
      success: true, 
      packages: createdPackages,
      message: "Packages seeded successfully" 
    });

  } catch (error) {
    console.error("Error seeding packages:", error);
    return NextResponse.json(
      { error: "Failed to seed packages" },
      { status: 500 }
    );
  }
}
