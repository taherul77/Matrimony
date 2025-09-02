import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Delete related records first (in correct order to avoid foreign key constraints)
    await prisma.dailyLimit.deleteMany({ where: { userId } });
    await prisma.profileVisit.deleteMany({ 
      where: { 
        OR: [
          { visitorId: userId },
          { visitedId: userId }
        ]
      }
    });
    await prisma.message.deleteMany({ 
      where: { 
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });
    await prisma.interest.deleteMany({ 
      where: { 
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });
    await prisma.match.deleteMany({ 
      where: { 
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      }
    });
    await prisma.subscription.deleteMany({ where: { userId } });
    await prisma.userPreference.deleteMany({ where: { userId } });
    await prisma.profile.deleteMany({ where: { userId } });

    // Finally delete the user
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
