import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = ["/validation-buttons", "/request-sent", "/document-receive", "/integrations", "/account"];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is in protectedRoutes
  const isProtectedRoute = protectedRoutes.some((route) => path.includes(route));

  // Get the authentication status from cookies or headers
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value;

  // If it's a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page with the original path as return URL
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    "/validation-buttons/:path*",
    "/request-sent/:path*",
    "/document-receive/:path*",
    "/integrations/:path*",
    "/account/:path*",
  ],
};
