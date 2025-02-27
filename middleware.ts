import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = [
  "/validation-buttons",
  "/request-sent",
  "/document-receive",
  "/integrations",
  "/account",
  "/resetpassword",
];

// Login page route
const loginRoute = "/";

// Two factor auth route
const twoFactorRoute = "/two-factor";

// Public authentication routes that don't require authentication
const publicAuthRoutes = ["/forgotpassword"];

// Routes that should not be directly accessible
const blockedDirectAccess = ["/authentication"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (path.includes("_next") || path.includes("api")) {
    return NextResponse.next();
  }

  // Get auth status from cookies
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value;
  const requiresTwoFactor = request.cookies.get("requiresTwoFactor")?.value;

  // Handle authentication routes
  if (path.startsWith("/authentication")) {
    // Allow only two-factor when requiresTwoFactor is set
    if (path === "/authentication/two-factor" && requiresTwoFactor) {
      return NextResponse.next();
    }
    // Redirect all other /authentication/* paths to login
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // Handle public routes
  if (path === "/forgotpassword") {
    return NextResponse.rewrite(new URL("/authentication/forgotpassword", request.url));
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    return isAuthenticated ? NextResponse.next() : NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // Handle login page access when authenticated
  if (path === loginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/validation-buttons", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    // Match specific routes instead of all routes
    "/",
    "/forgotpassword",
    "/resetpassword",
    "/two-factor",
    "/validation-buttons/:path*",
    "/request-sent/:path*",
    "/document-receive/:path*",
    "/integrations/:path*",
    "/account/:path*",
    "/authentication/:path*",
  ],
};
