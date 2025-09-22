import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/matches',
  '/messages',
  '/search',
  '/compatibility',
  '/interests',
  '/packages',
  '/vip',
  '/admin'
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if this is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If trying to access protected route without token
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // For protected routes, we'll let the UserContext handle token validation
    // The middleware just ensures a token exists
    return NextResponse.next();
  }

  // If trying to access auth routes while having a token
  if (isAuthRoute && token) {
    // If user has a token, redirect away from login/register
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};