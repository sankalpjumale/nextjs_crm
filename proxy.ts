import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {ROUTES} from "@/config/routes"

// const PUBLIC_ROUTES = [/^\/$/, /^\/sign-in(\/.*)?$/, /^\/sign-up(\/.*)?$/];

// function isPublicRoute(pathname: string) {
//   return PUBLIC_ROUTES.some((re) => re.test(pathname));
// }

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req.nextUrl.pathname)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//     // Always run for Clerk-specific frontend API routes
//     "/__clerk/(.*)",
//   ],
// };


//public
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health(.*)"
])

//signed in, but an active organization is not required
const isOrgOptionalRoute = createRouteMatcher(["/select-organization(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  //everything else requires a signed-in user
  await auth.protect()

  if (isOrgOptionalRoute(req)) return
  
  //everything else requires an active organization
  const { orgId } = await auth()
  if (!orgId) {
    return NextResponse.redirect(new URL(ROUTES.selectOrganization, req.url))
  }
})
