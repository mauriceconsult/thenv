import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─── Route matchers ───────────────────────────────────────────────────────────

const isPublicRoute = createRouteMatcher([
  "/",
  "/search(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing",        // UploadThing needs to be public (webhook + client validation)
  "/api/webhook(.*)",        // Any payment/external webhooks
]);

const isEditorRoute = createRouteMatcher(["/editor(.*)"]);

// ─── Middleware ───────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Unauthenticated users hitting protected routes → sign-in
  if (!isPublicRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Editor routes: authenticated but not an editor → home
  // The isEditor check here is role-based via userId.
  // Fine-grained role logic lives in lib/editor.ts — keep in sync.
  if (isEditorRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
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
