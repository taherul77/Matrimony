import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Parse query params for pagination
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "10", 10);
  const skip = (page - 1) * perPage;

  // Get total count
  const total = await prisma.user.count();

  // Get paginated users with profile
  const users = await prisma.user.findMany({
    skip,
    take: perPage,
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  // Format data for frontend
  const data = users.map((user) => ({
    user_id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    profile_image: (user.profile && user.profile.photos && user.profile.photos.length > 0)
      ? user.profile.photos[0]
      : (user.profileImage || null),
    profile: user.profile,
  }));

  // Pagination links
  const lastPage = Math.ceil(total / perPage);
  const baseUrl = req.nextUrl.origin + req.nextUrl.pathname;
  const makePageUrl = (p: number) => `${baseUrl}?page=${p}&per_page=${perPage}`;
  const links = [
    { url: page > 1 ? makePageUrl(page - 1) : null, label: "« Previous", active: false },
    ...Array.from({ length: lastPage }, (_, i) => ({
      url: makePageUrl(i + 1),
      label: String(i + 1),
      active: page === i + 1,
    })),
    { url: page < lastPage ? makePageUrl(page + 1) : null, label: "Next »", active: false },
  ];

  return NextResponse.json({
    data: {
      current_page: page,
      data,
      first_page_url: makePageUrl(1),
      from: skip + 1,
      last_page: lastPage,
      last_page_url: makePageUrl(lastPage),
      links,
      next_page_url: page < lastPage ? makePageUrl(page + 1) : null,
      path: baseUrl,
      per_page: perPage,
      prev_page_url: page > 1 ? makePageUrl(page - 1) : null,
      to: Math.min(skip + perPage, total),
      total,
    },
    code: 200,
    message: "Data fetch successfully."
  });
}
