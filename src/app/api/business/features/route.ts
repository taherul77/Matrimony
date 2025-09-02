import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { getUserPermissions, checkUserLimit, incrementUserUsage, maskContactDetails } from '@/lib/permissions';

const prisma = new PrismaClient();

// GET /api/business/features - Get user's current package features
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    // Get current usage
    const interestCheck = await checkUserLimit(userId, 'interests');
    const messageCheck = await checkUserLimit(userId, 'messages');
    const photoCheck = await checkUserLimit(userId, 'photos');

    return NextResponse.json({
      permissions,
      usage: {
        interests: {
          current: interestCheck.current,
          limit: interestCheck.limit,
          allowed: interestCheck.allowed
        },
        messages: {
          current: messageCheck.current,
          limit: messageCheck.limit,
          allowed: messageCheck.allowed
        },
        photos: {
          current: photoCheck.current,
          limit: photoCheck.limit,
          allowed: photoCheck.allowed
        }
      }
    });

  } catch (error) {
    console.error('Error getting user features:', error);
    return NextResponse.json({ error: 'Failed to get user features' }, { status: 500 });
  }
}

// POST /api/business/features - Check if user can perform specific action
export async function POST(request: Request) {
  try {
    const { action, userId, targetUserId } = await request.json();
    
    if (!action || !userId) {
      return NextResponse.json({ error: 'Action and userId required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);

    switch (action) {
      case 'send_interest':
        const interestCheck = await checkUserLimit(userId, 'interests');
        return NextResponse.json({
          allowed: interestCheck.allowed,
          message: interestCheck.message,
          current: interestCheck.current,
          limit: interestCheck.limit
        });

      case 'send_message':
        const messageCheck = await checkUserLimit(userId, 'messages');
        return NextResponse.json({
          allowed: messageCheck.allowed && permissions.canMessage,
          message: !permissions.canMessage ? 'Messaging not available in your package' : messageCheck.message,
          current: messageCheck.current,
          limit: messageCheck.limit
        });

      case 'upload_photo':
        const photoCheck = await checkUserLimit(userId, 'photos');
        return NextResponse.json({
          allowed: photoCheck.allowed,
          message: photoCheck.message,
          current: photoCheck.current,
          limit: photoCheck.limit
        });

      case 'view_contact':
        if (!targetUserId) {
          return NextResponse.json({ error: 'Target user ID required for contact view' }, { status: 400 });
        }
        
        // Get target user's contact details
        const targetUser = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { phone: true, email: true }
        });

        if (!targetUser) {
          return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
        }

        const maskedPhone = targetUser.phone ? maskContactDetails(targetUser.phone, permissions) : null;
        const maskedEmail = maskContactDetails(targetUser.email, permissions);

        return NextResponse.json({
          allowed: permissions.canViewContacts,
          canViewFull: permissions.canViewFullContacts,
          contact: {
            phone: maskedPhone,
            email: maskedEmail
          }
        });

      case 'advanced_search':
        return NextResponse.json({
          allowed: permissions.hasAdvancedSearch,
          message: !permissions.hasAdvancedSearch ? 'Advanced search not available in your package' : undefined
        });

      case 'view_profile_visitors':
        return NextResponse.json({
          allowed: permissions.canViewProfileVisitors,
          message: !permissions.canViewProfileVisitors ? 'Profile visitors feature not available in your package' : undefined
        });

      case 'browse_privately':
        return NextResponse.json({
          allowed: permissions.canBrowsePrivately,
          message: !permissions.canBrowsePrivately ? 'Private browsing not available in your package' : undefined
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error checking action permission:', error);
    return NextResponse.json({ error: 'Failed to check permission' }, { status: 500 });
  }
}
