import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserPermissions } from '@/lib/permissions';

const prisma = new PrismaClient();

// GET /api/vip/services - Get VIP services for user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    // Only VIP users can access these services
    if (!permissions.hasPersonalMatchmaker) {
      return NextResponse.json({ 
        error: 'VIP membership required for these services' 
      }, { status: 403 });
    }

    // Get user's VIP services data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { package: true }
        },
        handpickedMatches: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get dedicated support tickets or requests
    const supportRequests = await prisma.notification.findMany({
      where: {
        userId,
        type: 'support_request'
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get upcoming exclusive events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        date: {
          gt: new Date()
        },
        registeredUsers: {
          has: userId
        }
      },
      orderBy: { date: 'asc' },
      take: 5
    });

    return NextResponse.json({
      vipServices: {
        personalMatchmaker: permissions.hasPersonalMatchmaker,
        handpickedMatches: user.handpickedMatches,
        prioritySupport: permissions.hasPrioritySupport,
        supportRequests,
        eventAccess: permissions.hasEventAccess,
        upcomingEvents,
        profilePromotion: permissions.hasProfilePromotion,
        privacyControl: permissions.hasPrivacyControl
      },
      packageInfo: user.subscription?.package
    });

  } catch (error) {
    console.error('Error getting VIP services:', error);
    return NextResponse.json({ error: 'Failed to get VIP services' }, { status: 500 });
  }
}

// POST /api/vip/services - Request VIP service
export async function POST(request: Request) {
  try {
    const { userId, serviceType, details } = await request.json();
    
    if (!userId || !serviceType) {
      return NextResponse.json({ error: 'User ID and service type required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    switch (serviceType) {
      case 'personal_matchmaker_request':
        if (!permissions.hasPersonalMatchmaker) {
          return NextResponse.json({ 
            error: 'Personal matchmaker service requires VIP membership' 
          }, { status: 403 });
        }
        
        // Create support request for personal matchmaker
        await prisma.notification.create({
          data: {
            userId,
            type: 'support_request',
            title: 'Personal Matchmaker Request',
            content: details || 'Request for personal matchmaker assistance',
            data: JSON.stringify({ serviceType, details })
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Personal matchmaker request submitted successfully' 
        });

      case 'priority_support_request':
        if (!permissions.hasPrioritySupport) {
          return NextResponse.json({ 
            error: 'Priority support requires Platinum or VIP membership' 
          }, { status: 403 });
        }
        
        await prisma.notification.create({
          data: {
            userId,
            type: 'support_request',
            title: 'Priority Support Request',
            content: details || 'Priority support assistance needed',
            data: JSON.stringify({ serviceType, details, priority: true })
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Priority support request submitted successfully' 
        });

      case 'event_registration':
        if (!permissions.hasEventAccess) {
          return NextResponse.json({ 
            error: 'Event access requires VIP membership' 
          }, { status: 403 });
        }
        
        const { eventId } = details;
        const event = await prisma.event.findUnique({
          where: { id: eventId }
        });
        
        if (!event) {
          return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        
        // Check if already registered
        if (event.registeredUsers.includes(userId)) {
          return NextResponse.json({ 
            error: 'Already registered for this event' 
          }, { status: 400 });
        }
        
        // Check capacity
        if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
          return NextResponse.json({ 
            error: 'Event is full' 
          }, { status: 400 });
        }
        
        await prisma.event.update({
          where: { id: eventId },
          data: {
            registeredUsers: {
              push: userId
            }
          }
        });
        
        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            type: 'event_registration',
            title: 'Event Registration Confirmed',
            content: `You are now registered for ${event.title}`,
            data: JSON.stringify({ eventId, eventTitle: event.title })
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Successfully registered for the event' 
        });

      case 'profile_boost_request':
        if (!permissions.hasWeeklyBoost) {
          return NextResponse.json({ 
            error: 'Profile boost requires Platinum or VIP membership' 
          }, { status: 403 });
        }
        
        // Update user's profile boost expiry
        const boostExpiry = new Date();
        boostExpiry.setDate(boostExpiry.getDate() + 7); // 7 days boost
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            profileBoostExpiry: boostExpiry
          }
        });
        
        await prisma.notification.create({
          data: {
            userId,
            type: 'profile_boost',
            title: 'Profile Boosted Successfully',
            content: 'Your profile has been boosted for 7 days for better visibility',
            data: JSON.stringify({ boostExpiry })
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Profile boosted successfully for 7 days' 
        });

      default:
        return NextResponse.json({ error: 'Invalid service type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing VIP service request:', error);
    return NextResponse.json({ error: 'Failed to process VIP service request' }, { status: 500 });
  }
}
