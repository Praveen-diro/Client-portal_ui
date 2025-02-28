import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = [
  "/client/validation-buttons",
  "/client/requests-sent",
  "/client/documents-received",
  "/client/coverage",
  "/client/integrations",
  "/client/account",
  "/client/report-issue",
  "/client",
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
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (path.includes("_next") || path.includes("api")) {
    return NextResponse.next();
  }

  // Get auth status from cookies
  const apikey = request.cookies.get("apikey")?.value;
  const token = request.cookies.get("token")?.value;
  const email = request.cookies.get("email")?.value;
  const authMode = request.cookies.get("authMode")?.value;
  const isTwoFactor = request.cookies.get("isTwoFactor")?.value === "true";
  const twoFactorId = request.cookies.get("twoFactorId")?.value;
  const isAuthenticatedCookie = request.cookies.get("isAuthenticated")?.value === "true";

  // Determine authentication state - check both apikey and token
  const isAuthenticated = apikey || token ? true : false || isAuthenticatedCookie;
  const needsTwoFactor = email && authMode && isTwoFactor && twoFactorId;

  // Debug log in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Middleware - Auth State:", {
      path,
      isAuthenticated,
      needsTwoFactor,
      apikey: apikey ? "exists" : "missing",
      token: token ? "exists" : "missing",
      email,
      authMode,
      isTwoFactor,
    });
  }

  // Handle authentication routes
  if (path.startsWith("/authentication")) {
    // Allow two-factor page when two-factor is needed
    if (path === "/authentication/two-factor" && needsTwoFactor) {
      return NextResponse.next();
    }
    // Redirect all other /authentication/* paths to login
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // Handle two-factor auth path
  if (path === "/two-factor") {
    if (needsTwoFactor) {
      // User needs to complete two-factor auth
      return NextResponse.rewrite(new URL(twoFactorRoute, request.url));
    } else if (isAuthenticated) {
      // User is already authenticated, redirect to protected area
      return NextResponse.redirect(new URL("/client/validation-buttons", request.url));
    } else {
      // User is not authenticated at all, redirect to login
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
  }

  // Handle public routes
  if (path === "/forgotpassword") {
    return NextResponse.rewrite(new URL("/authentication/forgotpassword", request.url));
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (isAuthenticated) {
      // If authenticated but still has two-factor flags, clear them by redirecting back
      // This handles cases where two-factor was completed but flags weren't reset
      if (needsTwoFactor && path !== "/client/validation-buttons") {
        const response = NextResponse.redirect(new URL("/client/validation-buttons", request.url));
        // Clear two-factor cookies
        response.cookies.delete("isTwoFactor");
        response.cookies.delete("twoFactorId");
        return response;
      }
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
  }

  // Redirect to 2FA if user needs to complete two-factor auth
  if (needsTwoFactor && path !== "/two-factor") {
    return NextResponse.redirect(new URL("/two-factor", request.url));
  }

  // Handle login page access when authenticated
  if (path === loginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/client/validation-buttons", request.url));
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
    "/client/validation-buttons/:path*",
    "/client/requests-sent/:path*",
    "/client/documents-received/:path*",
    "/client/coverage/:path*",
    "/client/integrations/:path*",
    "/client/account/:path*",
    "/client/report-issue/:path*",
    "/authentication/:path*",
    "/client/:path*",
  ],
};
