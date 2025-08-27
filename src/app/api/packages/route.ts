import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const packages = await prisma.package.findMany({ orderBy: { price: "asc" } });
    return NextResponse.json({ packages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, duration, features } = body;
    if (!name || price === undefined || price === null || !duration || !features) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const newPackage = await prisma.package.create({
      data: {
        name,
        price: Number(price),
        duration: Number(duration),
        features: Array.isArray(features) ? features : [],
      },
    });
    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
