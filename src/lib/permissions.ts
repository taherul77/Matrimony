import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserPermissions {
  maxPhotos: number;
  maxInterests: number;
  monthlyMessages: number;
  canMessage: boolean;
  canViewContacts: boolean;
  canViewFullContacts: boolean;
  priorityLevel: number;
  hasVipBadge: boolean;
  isFeatured: boolean;
  hasAdvancedSearch: boolean;
  hasProfileHighlight: boolean;
  hasWeeklyBoost: boolean;
  hasDedicatedSupport: boolean;
  hasCompatibilityTools: boolean;
  canBrowsePrivately: boolean;
  canViewProfileVisitors: boolean;
  hasPersonalMatchmaker: boolean;
  hasHandpickedMatches: boolean;
  hasPrioritySupport: boolean;
  hasEventAccess: boolean;
  hasProfilePromotion: boolean;
  hasPrivacyControl: boolean;
}

export async function getUserPermissions(userId: string): Promise<UserPermissions> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            package: true
          }
        }
      }
    });

    if (!user || !user.subscription || !user.subscription.isActive) {
      // Free Package - Basic features only
      return {
        maxPhotos: 2,          // Limited photo uploads (1–2 photos)
        maxInterests: 3,       // Send limited interests per day (2–3)
        monthlyMessages: 0,    // No direct messaging
        canMessage: false,     // Can only receive messages from Premium members
        canViewContacts: false,// Cannot view contact details
        canViewFullContacts: false,
        priorityLevel: 0,      // No priority in search
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
      };
    }

    const packageName = user.subscription.package.name.toLowerCase();
    
    switch (packageName) {
      case 'silver':
        // Silver Package - Affordable entry-level premium
        return {
          maxPhotos: 5,          // Upload up to 5 photos
          maxInterests: 20,      // Send up to 20 interests per day
          monthlyMessages: 10,   // Limited direct messaging (10 per month)
          canMessage: true,      // Can send direct messages
          canViewContacts: true, // Basic contact details visible (partially masked)
          canViewFullContacts: false,
          priorityLevel: 1,      // Priority in search results (lower level)
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
        };

      case 'gold':
        // Gold Package - Mid-range premium
        return {
          maxPhotos: -1,         // Upload unlimited photos
          maxInterests: -1,      // Send unlimited interests
          monthlyMessages: -1,   // Unlimited direct messaging
          canMessage: true,
          canViewContacts: true,
          canViewFullContacts: true, // View full contact details
          priorityLevel: 2,
          hasVipBadge: false,
          isFeatured: true,      // Appear in "Featured Profiles" section
          hasAdvancedSearch: true, // Advanced search filters
          hasProfileHighlight: true, // Profile highlighted for better visibility
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
        };

      case 'platinum':
        // Platinum Package - Higher premium tier
        return {
          maxPhotos: -1,         // All Gold features
          maxInterests: -1,
          monthlyMessages: -1,
          canMessage: true,
          canViewContacts: true,
          canViewFullContacts: true,
          priorityLevel: 3,      // Appear top in search results
          hasVipBadge: true,     // VIP badge on profile
          isFeatured: true,
          hasAdvancedSearch: true,
          hasProfileHighlight: true,
          hasWeeklyBoost: true,  // Profile boosted weekly for extra visibility
          hasDedicatedSupport: true, // Dedicated customer support
          hasCompatibilityTools: true, // Access to horoscope/compatibility matching tools
          canBrowsePrivately: true,    // Option to hide online status / browse privately
          canViewProfileVisitors: true, // View who visited your profile
          hasPersonalMatchmaker: false,
          hasHandpickedMatches: false,
          hasPrioritySupport: false,
          hasEventAccess: false,
          hasProfilePromotion: false,
          hasPrivacyControl: false,
        };

      case 'vip':
      case 'elite':
        // VIP / Elite Package - Premium exclusive tier
        return {
          maxPhotos: -1,         // All Platinum features
          maxInterests: -1,
          monthlyMessages: -1,
          canMessage: true,
          canViewContacts: true,
          canViewFullContacts: true,
          priorityLevel: 4,      // Highest priority
          hasVipBadge: true,
          isFeatured: true,
          hasAdvancedSearch: true,
          hasProfileHighlight: true,
          hasWeeklyBoost: true,
          hasDedicatedSupport: true,
          hasCompatibilityTools: true,
          canBrowsePrivately: true,
          canViewProfileVisitors: true,
          hasPersonalMatchmaker: true,    // Dedicated relationship manager / personal matchmaker
          hasHandpickedMatches: true,     // Handpicked matches sent directly
          hasPrioritySupport: true,       // Priority support (24/7 helpline)
          hasEventAccess: true,           // Invitations to exclusive matchmaking events / webinars
          hasProfilePromotion: true,      // Profile promoted across platform newsletters & ads
          hasPrivacyControl: true,        // Complete privacy control
        };

      default:
        // Fallback to Free package
        return {
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
        };
    }
  } catch (error) {
    console.error("Error getting user permissions:", error);
    // Return free user permissions on error
    return {
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
    };
  }
}

export async function checkUserLimit(userId: string, action: 'interests' | 'messages' | 'photos'): Promise<{ allowed: boolean; current: number; limit: number; message?: string }> {
  try {
    const permissions = await getUserPermissions(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (action === 'interests') {
      const todayLimits = await prisma.dailyLimit.findFirst({
        where: {
          userId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      const currentInterests = todayLimits?.interestsSent || 0;
      const limit = permissions.maxInterests;
      
      if (limit === -1) {
        return { allowed: true, current: currentInterests, limit: -1 };
      }

      return {
        allowed: currentInterests < limit,
        current: currentInterests,
        limit,
        message: currentInterests >= limit ? `Daily interest limit (${limit}) reached. Upgrade your package for more interests.` : undefined
      };
    }

    if (action === 'messages') {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { allowed: false, current: 0, limit: 0, message: "User not found" };
      }

      // Check if we need to reset monthly counter
      const now = new Date();
      const lastReset = user.lastMessageReset ? new Date(user.lastMessageReset) : new Date(0);
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth());

      let currentMessages = user.monthlyMessages;
      if (monthsDiff >= 1 || !user.lastMessageReset) {
        // Reset monthly counter
        currentMessages = 0;
        await prisma.user.update({
          where: { id: userId },
          data: {
            monthlyMessages: 0,
            lastMessageReset: now
          }
        });
      }

      const limit = permissions.monthlyMessages;
      
      if (!permissions.canMessage) {
        return { allowed: false, current: currentMessages, limit: 0, message: "Messaging not allowed with your current package" };
      }

      if (limit === -1) {
        return { allowed: true, current: currentMessages, limit: -1 };
      }

      return {
        allowed: currentMessages < limit,
        current: currentMessages,
        limit,
        message: currentMessages >= limit ? `Monthly message limit (${limit}) reached. Upgrade your package for more messages.` : undefined
      };
    }

    if (action === 'photos') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        return { allowed: false, current: 0, limit: 0, message: "User not found" };
      }

      const currentPhotos = user.profile?.photos?.length || 0;
      const limit = permissions.maxPhotos;

      if (limit === -1) {
        return { allowed: true, current: currentPhotos, limit: -1 };
      }

      return {
        allowed: currentPhotos < limit,
        current: currentPhotos,
        limit,
        message: currentPhotos >= limit ? `Photo upload limit (${limit}) reached. Upgrade your package for more photos.` : undefined
      };
    }

    return { allowed: false, current: 0, limit: 0, message: "Invalid action" };

  } catch (error) {
    console.error("Error checking user limit:", error);
    return { allowed: false, current: 0, limit: 0, message: "Error checking limits" };
  }
}

export async function incrementUserUsage(userId: string, action: 'interests' | 'messages'): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (action === 'interests') {
      await prisma.dailyLimit.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        update: {
          interestsSent: {
            increment: 1
          }
        },
        create: {
          userId,
          date: today,
          interestsSent: 1,
          messagesSent: 0,
          profileViews: 0
        }
      });
    }

    if (action === 'messages') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyMessages: {
            increment: 1
          }
        }
      });
    }
  } catch (error) {
    console.error("Error incrementing user usage:", error);
  }
}

export function maskContactDetails(contact: string, userPermissions: UserPermissions): string {
  if (userPermissions.canViewFullContacts) {
    return contact;
  }

  if (!userPermissions.canViewContacts) {
    return "****";
  }

  // Partially mask for Silver users
  if (contact.includes('@')) {
    // Email masking
    const [local, domain] = contact.split('@');
    return `${local.substring(0, 2)}****@${domain}`;
  } else {
    // Phone masking
    return `${contact.substring(0, 3)}****${contact.substring(contact.length - 2)}`;
  }
}
