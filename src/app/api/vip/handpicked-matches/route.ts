import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserPermissions } from '@/lib/permissions';

const prisma = new PrismaClient();

// GET /api/vip/handpicked-matches - Get handpicked matches for VIP users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    if (!permissions.hasHandpickedMatches) {
      return NextResponse.json({ 
        error: 'Handpicked matches feature requires VIP membership' 
      }, { status: 403 });
    }

    // Get user's handpicked matches
    const handpickedMatches = await prisma.handpickedMatch.findMany({
      where: { receiverId: userId },
      include: {
        receiver: {
          include: {
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get match user details for each handpicked match
    const matchesWithDetails = await Promise.all(
      handpickedMatches.map(async (match) => {
        const matchUser = await prisma.user.findUnique({
          where: { id: match.matchUserId },
          include: {
            profile: true
          }
        });

        return {
          ...match,
          matchUser
        };
      })
    );

    return NextResponse.json({
      handpickedMatches: matchesWithDetails,
      total: matchesWithDetails.length
    });

  } catch (error) {
    console.error('Error getting handpicked matches:', error);
    return NextResponse.json({ error: 'Failed to get handpicked matches' }, { status: 500 });
  }
}

// POST /api/vip/handpicked-matches - Create handpicked match (Admin only)
export async function POST(request: Request) {
  try {
    const { receiverId, matchUserId, reason } = await request.json();
    
    if (!receiverId || !matchUserId) {
      return NextResponse.json({ 
        error: 'Receiver ID and match user ID required' 
      }, { status: 400 });
    }

    // Verify receiver has VIP access
    const permissions = await getUserPermissions(receiverId);
    if (!permissions.hasHandpickedMatches) {
      return NextResponse.json({ 
        error: 'Receiver must have VIP membership for handpicked matches' 
      }, { status: 403 });
    }

    // Check if match already exists
    const existingMatch = await prisma.handpickedMatch.findUnique({
      where: {
        receiverId_matchUserId: {
          receiverId,
          matchUserId
        }
      }
    });

    if (existingMatch) {
      return NextResponse.json({ 
        error: 'Handpicked match already exists for this user' 
      }, { status: 400 });
    }

    // Create handpicked match
    const handpickedMatch = await prisma.handpickedMatch.create({
      data: {
        receiverId,
        matchUserId,
        reason: reason || 'Curated match based on compatibility analysis'
      }
    });

    // Create notification for the receiver
    const matchUser = await prisma.user.findUnique({
      where: { id: matchUserId },
      select: { name: true }
    });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'handpicked_match',
        title: 'New Handpicked Match!',
        content: `Your personal matchmaker has found a special match for you: ${matchUser?.name}`,
        data: JSON.stringify({ 
          matchUserId, 
          handpickedMatchId: handpickedMatch.id,
          reason 
        })
      }
    });

    return NextResponse.json({
      success: true,
      handpickedMatch,
      message: 'Handpicked match created successfully'
    });

  } catch (error) {
    console.error('Error creating handpicked match:', error);
    return NextResponse.json({ error: 'Failed to create handpicked match' }, { status: 500 });
  }
}

// PUT /api/vip/handpicked-matches - Update handpicked match status
export async function PUT(request: Request) {
  try {
    const { handpickedMatchId, status, userId } = await request.json();
    
    if (!handpickedMatchId || !status || !userId) {
      return NextResponse.json({ 
        error: 'Handpicked match ID, status, and user ID required' 
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'viewed', 'interested', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      }, { status: 400 });
    }

    // Verify user has access to this handpicked match
    const handpickedMatch = await prisma.handpickedMatch.findUnique({
      where: { id: handpickedMatchId }
    });

    if (!handpickedMatch || handpickedMatch.receiverId !== userId) {
      return NextResponse.json({ 
        error: 'Handpicked match not found or access denied' 
      }, { status: 404 });
    }

    // Update status
    const updatedMatch = await prisma.handpickedMatch.update({
      where: { id: handpickedMatchId },
      data: { status }
    });

    // If user showed interest, create an interest record
    if (status === 'interested') {
      await prisma.interest.create({
        data: {
          senderId: userId,
          receiverId: handpickedMatch.matchUserId,
          message: 'I found your profile through our matchmaker and would like to connect!'
        }
      });

      // Notify the match user
      await prisma.notification.create({
        data: {
          userId: handpickedMatch.matchUserId,
          type: 'interest_received',
          title: 'Someone is interested in you!',
          content: 'A VIP member showed interest in your profile through our matchmaking service',
          data: JSON.stringify({ 
            senderId: userId,
            vipMatch: true
          })
        }
      });
    }

    return NextResponse.json({
      success: true,
      handpickedMatch: updatedMatch,
      message: `Handpicked match status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating handpicked match:', error);
    return NextResponse.json({ error: 'Failed to update handpicked match' }, { status: 500 });
  }
}
