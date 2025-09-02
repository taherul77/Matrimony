import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserPermissions } from '@/lib/permissions';

const prisma = new PrismaClient();

// GET /api/vip/events - Get exclusive events for VIP users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'all'; // 'upcoming', 'registered', 'all'
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const permissions = await getUserPermissions(userId);
    
    if (!permissions.hasEventAccess) {
      return NextResponse.json({ 
        error: 'Event access requires VIP membership' 
      }, { status: 403 });
    }

    const whereClause: any = {
      isActive: true
    };

    if (type === 'upcoming') {
      whereClause.date = { gt: new Date() };
    } else if (type === 'registered') {
      whereClause.registeredUsers = { has: userId };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });

    // Add registration status for each event
    const eventsWithStatus = events.map(event => ({
      ...event,
      isRegistered: event.registeredUsers.includes(userId),
      availableSpots: event.maxAttendees ? event.maxAttendees - event.registeredUsers.length : null,
      isFull: event.maxAttendees ? event.registeredUsers.length >= event.maxAttendees : false
    }));

    return NextResponse.json({
      events: eventsWithStatus,
      total: eventsWithStatus.length
    });

  } catch (error) {
    console.error('Error getting VIP events:', error);
    return NextResponse.json({ error: 'Failed to get VIP events' }, { status: 500 });
  }
}

// POST /api/vip/events - Create new exclusive event (Admin only)
export async function POST(request: Request) {
  try {
    const { 
      title, 
      description, 
      eventType, 
      date, 
      location, 
      isOnline, 
      maxAttendees 
    } = await request.json();
    
    if (!title || !description || !eventType || !date) {
      return NextResponse.json({ 
        error: 'Title, description, event type, and date are required' 
      }, { status: 400 });
    }

    const validEventTypes = ['webinar', 'meetup', 'matchmaking_event'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json({ 
        error: 'Invalid event type. Must be one of: ' + validEventTypes.join(', ') 
      }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventType,
        date: new Date(date),
        location: location || null,
        isOnline: isOnline || false,
        maxAttendees: maxAttendees || null,
        registeredUsers: []
      }
    });

    // Notify all VIP users about the new event
    const vipUsers = await prisma.user.findMany({
      where: {
        subscription: {
          package: {
            hasEventAccess: true
          },
          isActive: true
        }
      },
      select: { id: true }
    });

    // Create notifications for all VIP users
    const notifications = vipUsers.map(user => ({
      userId: user.id,
      type: 'new_event',
      title: 'New Exclusive Event Available!',
      content: `${title} - Register now for this exclusive VIP event`,
      data: JSON.stringify({ 
        eventId: event.id,
        eventType,
        date: event.date
      })
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    return NextResponse.json({
      success: true,
      event,
      message: 'Event created successfully and VIP users have been notified'
    });

  } catch (error) {
    console.error('Error creating VIP event:', error);
    return NextResponse.json({ error: 'Failed to create VIP event' }, { status: 500 });
  }
}
