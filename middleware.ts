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
const twoFactorConfigureRoute = "/authentication/two-factor-configure";

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
  const multiFactorEnabled = request.cookies.get("multiFactorEnabled")?.value === "true";

  // EMERGENCY FIX - Force redirect to config page when path is two-factor verification
  // but multiFactorEnabled is not true
  if (path === "/authentication/two-factor" && request.cookies.get("multiFactorEnabled")?.value !== "true" && twoFactorId) {
    console.log("🚨 EMERGENCY REDIRECT: User with multiFactorEnabled=false trying to access verification page");
    return NextResponse.redirect(new URL(twoFactorConfigureRoute, request.url));
  }

  // DEBUGGING - Log all relevant cookies
  console.log("ALL AUTH COOKIES:", {
    path,
    multiFactorEnabled,
    multiFactorEnabledRawValue: request.cookies.get("multiFactorEnabled")?.value,
    isTwoFactor,
    twoFactorId,
    email,
    authMode,
    isAuthenticated: isAuthenticatedCookie,
  });

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
    // Specifically handle the two-factor paths
    if (path === "/authentication/two-factor" || path === "/authentication/two-factor-configure") {
      if (needsTwoFactor) {
        // Force routing based on multiFactorEnabled
        const multiFactorValue = request.cookies.get("multiFactorEnabled")?.value;
        console.log("Two-factor path direct access:", {
          path,
          multiFactorValue,
          shouldConfigureFirst: multiFactorValue !== "true",
        });

        // If not configured yet and trying to access verification page, redirect to config
        if (path === "/authentication/two-factor" && multiFactorValue !== "true") {
          console.log("REDIRECTING: User needs to configure 2FA first");
          return NextResponse.redirect(new URL(twoFactorConfigureRoute, request.url));
        }

        // If already configured and trying to access config page, redirect to verification
        if (path === "/authentication/two-factor-configure" && multiFactorValue === "true") {
          console.log("REDIRECTING: User already configured 2FA, sending to verification");
          return NextResponse.redirect(new URL(twoFactorRoute, request.url));
        }

        return NextResponse.next();
      }
    }
    // Redirect all other /authentication/* paths to login
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // Handle two-factor auth path
  if (path === "/two-factor") {
    if (needsTwoFactor) {
      // User needs to complete two-factor auth - either configuration or verification
      const multiFactorValue = request.cookies.get("multiFactorEnabled")?.value;
      const isConfigured = multiFactorValue === "true";

      // Explicitly choose destination based on configuration status
      const redirectUrl = isConfigured ? twoFactorRoute : twoFactorConfigureRoute;

      console.log("Two-factor routing decision:", {
        multiFactorValue,
        isConfigured,
        redirectUrl,
        destination: isConfigured ? "verification page" : "configuration page",
      });

      return NextResponse.rewrite(new URL(redirectUrl, request.url));
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
