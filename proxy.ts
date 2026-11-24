import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROUTES } from "@/config/routes";

/**
 * IMPORTANT: this proxy is a UX/performance optimization, NOT the security
 * boundary. Every page, layout, Server Action and non-public Route Handler
 * performs its own check (requireUserId / requireTenantContext).
 * Removing everything below must never expose data.
 */

// Zone 1: public pages. No sign-in needed.
const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/api/health"];

// Zone 2: signed in, but an active organization is not required.
const ORG_OPTIONAL_PREFIXES: readonly string[] = [ROUTES.selectOrganization];

// Anything that ends in a file extension (.css, .js, .ico, ...) is a static
// file, never a page. Safety net in case the matcher below is ever wrong.
const STATIC_FILE = /\.[a-z0-9]+$/i;

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Only page navigations get early redirects.
  // - Server Actions (POST) and API routes reach their own guard, which
  //   answers 401/404 correctly.
  // - Next.js internals and static files must never be redirected.
  if (
    req.method !== "GET" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    STATIC_FILE.test(pathname)
  ) {
    return;
  }

  if (matchesPrefix(pathname, PUBLIC_PREFIXES)) return;

  const { isAuthenticated, orgId, redirectToSignIn } = await auth();

  // Zone 3 (everything else) requires a signed-in user...
  if (!isAuthenticated) return redirectToSignIn();

  // ...who has an active organization.
  if (!orgId && !matchesPrefix(pathname, ORG_OPTIONAL_PREFIXES)) {
    return NextResponse.redirect(new URL(ROUTES.selectOrganization, req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
