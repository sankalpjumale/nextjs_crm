import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROUTES } from "@/config/routes";

const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/api/health"];
const ORG_OPTIONAL_PREFIXES = [ROUTES.selectOrganization];

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default clerkMiddleware(async (auth, req) => {
  // IMPORTANT: everything below is a UX/performance optimization.
  // It is NOT the security boundary. Every resource checks for itself.
  const { pathname } = req.nextUrl;

  // Only page navigations get early redirects. Server Actions (POST) and
  // API routes reach their own guard, which returns 401/404 as appropriate.
  if (req.method !== "GET" || pathname.startsWith("/api/")) return;
  if (matchesPrefix(pathname, PUBLIC_PREFIXES)) return;

  const { isAuthenticated, orgId, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  if (!orgId && !matchesPrefix(pathname, ORG_OPTIONAL_PREFIXES)) {
    return NextResponse.redirect(new URL(ROUTES.selectOrganization, req.url));
  }
});
