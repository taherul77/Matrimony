import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserPermissions } from '@/lib/permissions';

const prisma = new PrismaClient();

// GET /api/compatibility/analyze - Get compatibility analysis for premium users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const targetUserId = searchParams.get('targetUserId');
    
    if (!userId || !targetUserId) {
      return NextResponse.json({ 
        error: 'User ID and target user ID required' 
      }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    if (!permissions.hasCompatibilityTools) {
      return NextResponse.json({ 
        error: 'Compatibility analysis requires Platinum or VIP membership' 
      }, { status: 403 });
    }

    // Check if analysis already exists
    let existingAnalysis = await prisma.compatibilityScore.findUnique({
      where: {
        userAId_userBId: {
          userAId: userId,
          userBId: targetUserId
        }
      }
    });

    // If no analysis exists, try reverse order
    if (!existingAnalysis) {
      existingAnalysis = await prisma.compatibilityScore.findUnique({
        where: {
          userAId_userBId: {
            userAId: targetUserId,
            userBId: userId
          }
        }
      });
    }

    if (existingAnalysis) {
      return NextResponse.json({
        analysis: existingAnalysis,
        cached: true
      });
    }

    // Get both users' data for analysis
    const [userA, userB] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          preferences: true
        }
      }),
      prisma.user.findUnique({
        where: { id: targetUserId },
        include: {
          profile: true,
          preferences: true
        }
      })
    ]);

    if (!userA || !userB) {
      return NextResponse.json({ error: 'One or both users not found' }, { status: 404 });
    }

    // Perform compatibility analysis
    const compatibilityAnalysis = calculateCompatibility(userA, userB);

    // Save analysis to database
    const savedAnalysis = await prisma.compatibilityScore.create({
      data: {
        userAId: userId,
        userBId: targetUserId,
        score: compatibilityAnalysis.score,
        factors: compatibilityAnalysis.factors,
        horoscope: compatibilityAnalysis.horoscope
      }
    });

    return NextResponse.json({
      analysis: savedAnalysis,
      cached: false,
      details: compatibilityAnalysis.details
    });

  } catch (error) {
    console.error('Error performing compatibility analysis:', error);
    return NextResponse.json({ error: 'Failed to perform compatibility analysis' }, { status: 500 });
  }
}

// POST /api/compatibility/analyze - Bulk compatibility analysis for user
export async function POST(request: Request) {
  try {
    const { userId, candidateUserIds } = await request.json();
    
    if (!userId || !candidateUserIds || !Array.isArray(candidateUserIds)) {
      return NextResponse.json({ 
        error: 'User ID and array of candidate user IDs required' 
      }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    if (!permissions.hasCompatibilityTools) {
      return NextResponse.json({ 
        error: 'Compatibility analysis requires Platinum or VIP membership' 
      }, { status: 403 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get candidate users data
    const candidates = await prisma.user.findMany({
      where: {
        id: { in: candidateUserIds }
      },
      include: {
        profile: true,
        preferences: true
      }
    });

    // Perform batch compatibility analysis
    const analyses = [];
    
    for (const candidate of candidates) {
      // Check if analysis already exists
      const existingAnalysis = await prisma.compatibilityScore.findFirst({
        where: {
          OR: [
            { userAId: userId, userBId: candidate.id },
            { userAId: candidate.id, userBId: userId }
          ]
        }
      });

      if (existingAnalysis) {
        analyses.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          analysis: existingAnalysis,
          cached: true
        });
      } else {
        // Calculate new compatibility
        const compatibilityAnalysis = calculateCompatibility(user, candidate);
        
        // Save to database
        const savedAnalysis = await prisma.compatibilityScore.create({
          data: {
            userAId: userId,
            userBId: candidate.id,
            score: compatibilityAnalysis.score,
            factors: compatibilityAnalysis.factors,
            horoscope: compatibilityAnalysis.horoscope
          }
        });

        analyses.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          analysis: savedAnalysis,
          cached: false,
          details: compatibilityAnalysis.details
        });
      }
    }

    // Sort by compatibility score
    analyses.sort((a, b) => b.analysis.score - a.analysis.score);

    return NextResponse.json({
      compatibilityAnalyses: analyses,
      totalAnalyzed: analyses.length
    });

  } catch (error) {
    console.error('Error performing bulk compatibility analysis:', error);
    return NextResponse.json({ error: 'Failed to perform bulk compatibility analysis' }, { status: 500 });
  }
}

// Compatibility calculation function
function calculateCompatibility(userA: any, userB: any) {
  let score = 0;
  const factors = [];
  const details: any = {};

  // Age compatibility (max 15 points)
  const ageDiff = Math.abs(userA.age - userB.age);
  let ageScore = 0;
  if (ageDiff <= 2) ageScore = 15;
  else if (ageDiff <= 5) ageScore = 12;
  else if (ageDiff <= 10) ageScore = 8;
  else if (ageDiff <= 15) ageScore = 5;
  else ageScore = 2;
  
  score += ageScore;
  factors.push('Age compatibility');
  details.age = { score: ageScore, difference: ageDiff };

  // Location compatibility (max 10 points)
  if (userA.profile?.location && userB.profile?.location) {
    const locationScore = userA.profile.location.toLowerCase() === userB.profile.location.toLowerCase() ? 10 : 5;
    score += locationScore;
    factors.push('Location match');
    details.location = { score: locationScore, match: locationScore === 10 };
  }

  // Education compatibility (max 10 points)
  if (userA.profile?.education && userB.profile?.education) {
    const educationScore = userA.profile.education.toLowerCase() === userB.profile.education.toLowerCase() ? 10 : 7;
    score += educationScore;
    factors.push('Education level');
    details.education = { score: educationScore, match: educationScore === 10 };
  }

  // Religion compatibility (max 15 points)
  if (userA.profile?.religion && userB.profile?.religion) {
    const religionScore = userA.profile.religion.toLowerCase() === userB.profile.religion.toLowerCase() ? 15 : 5;
    score += religionScore;
    factors.push('Religious beliefs');
    details.religion = { score: religionScore, match: religionScore === 15 };
  }

  // Marital status compatibility (max 10 points)
  if (userA.profile?.maritalStatus && userB.profile?.maritalStatus) {
    const maritalScore = userA.profile.maritalStatus === userB.profile.maritalStatus ? 10 : 6;
    score += maritalScore;
    factors.push('Marital status');
    details.maritalStatus = { score: maritalScore, match: maritalScore === 10 };
  }

  // Lifestyle compatibility (max 10 points)
  if (userA.profile?.lifestyle && userB.profile?.lifestyle) {
    const lifestyleScore = userA.profile.lifestyle.toLowerCase() === userB.profile.lifestyle.toLowerCase() ? 10 : 6;
    score += lifestyleScore;
    factors.push('Lifestyle preferences');
    details.lifestyle = { score: lifestyleScore, match: lifestyleScore === 10 };
  }

  // Language compatibility (max 10 points)
  if (userA.profile?.languages && userB.profile?.languages) {
    const commonLanguages = userA.profile.languages.filter((lang: string) => 
      userB.profile.languages.includes(lang)
    );
    const languageScore = Math.min(commonLanguages.length * 3, 10);
    score += languageScore;
    factors.push('Common languages');
    details.languages = { score: languageScore, common: commonLanguages };
  }

  // Income compatibility (max 10 points) - if both have income preferences
  if (userA.profile?.minIncome && userA.profile?.maxIncome && 
      userB.profile?.minIncome && userB.profile?.maxIncome) {
    
    const incomeCompatible = (
      (userB.profile.minIncome >= userA.profile.minIncome && userB.profile.minIncome <= userA.profile.maxIncome) ||
      (userA.profile.minIncome >= userB.profile.minIncome && userA.profile.minIncome <= userB.profile.maxIncome)
    );
    
    const incomeScore = incomeCompatible ? 10 : 5;
    score += incomeScore;
    factors.push('Income compatibility');
    details.income = { score: incomeScore, compatible: incomeCompatible };
  }

  // Height compatibility (max 5 points)
  if (userA.profile?.minHeight && userA.profile?.maxHeight && 
      userB.profile?.minHeight && userB.profile?.maxHeight) {
    
    const heightCompatible = (
      (userB.profile.minHeight >= userA.profile.minHeight && userB.profile.minHeight <= userA.profile.maxHeight) ||
      (userA.profile.minHeight >= userB.profile.minHeight && userA.profile.minHeight <= userB.profile.maxHeight)
    );
    
    const heightScore = heightCompatible ? 5 : 2;
    score += heightScore;
    factors.push('Height preferences');
    details.height = { score: heightScore, compatible: heightCompatible };
  }

  // Horoscope compatibility (basic implementation)
  const horoscope = generateHoroscopeCompatibility(userA, userB);

  return {
    score: Math.min(score, 100), // Cap at 100
    factors,
    horoscope,
    details
  };
}

function generateHoroscopeCompatibility(userA: any, userB: any) {
  // This is a simplified horoscope compatibility
  // In a real application, you would use birth dates, zodiac signs, etc.
  const compatibilityMessages = [
    "The stars align favorably for this match. Strong potential for harmony.",
    "Celestial bodies suggest good compatibility with some challenges to overcome.",
    "Moderate astrological compatibility. Communication will be key.",
    "The universe indicates a need for patience and understanding.",
    "Stellar alignment shows promise for a balanced relationship."
  ];

  return compatibilityMessages[Math.floor(Math.random() * compatibilityMessages.length)];
}
