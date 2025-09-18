import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, price, duration, features } = body;
    const updated = await prisma.package.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        duration: Number(duration),
        features: Array.isArray(features) ? features : [],
      },
    });
    return NextResponse.json({ package: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: body
    });

    return NextResponse.json({ package: updatedPackage });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Check if there are active subscriptions for this package
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        packageId: id,
        isActive: true
      }
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json({ 
        error: "Cannot delete package with active subscriptions" 
      }, { status: 400 });
    }

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
