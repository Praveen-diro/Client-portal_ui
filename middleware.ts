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
const twoFactorRoute = "/authentication/two-factor";

// Public authentication routes that don't require authentication
const publicAuthRoutes = ["/forgotpassword"];

// Routes that should not be directly accessible
const blockedDirectAccess = ["/authentication"];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Block direct access to authentication folder routes
  if (blockedDirectAccess.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // Get the authentication status and two-factor status from cookies
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value;
  const requiresTwoFactor = request.cookies.get("requiresTwoFactor")?.value;

  // Check if the path is in protectedRoutes
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  // Check if current path is two-factor page
  const isTwoFactorPage = path === twoFactorRoute;

  // Check if current path is login page
  const isLoginPage = path === loginRoute;

  // Check if current path is a public auth route
  const isPublicAuthRoute = publicAuthRoutes.some((route) => path === route);

  // Allow access to public auth routes without authentication
  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  // If trying to access two-factor page without going through login
  if (isTwoFactorPage && !requiresTwoFactor) {
    // Redirect to login page
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // If authenticated user tries to access login or 2FA page
  if (isAuthenticated && (isLoginPage || isTwoFactorPage)) {
    // Redirect to default protected route
    return NextResponse.redirect(new URL("/validation-buttons", request.url));
  }

  // If trying to access protected routes without authentication
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
