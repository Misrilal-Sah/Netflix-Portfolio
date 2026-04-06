import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { PROFILE_TYPES } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject pathname so Server Component layouts can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Refresh Supabase auth session (no-op when env vars are not configured)
  const supabase = createMiddlewareClient(request, response);
  if (supabase) await supabase.auth.getUser();

  // Validate profile routes: /[profile]/*
  const profileSegment = pathname.split("/")[1];
  if (
    profileSegment &&
    !profileSegment.startsWith("_next") &&
    !profileSegment.startsWith("api") &&
    !profileSegment.startsWith("admin") &&
    !profileSegment.startsWith("images") &&
    !profileSegment.startsWith("sounds") &&
    profileSegment !== "favicon.ico" &&
    !profileSegment.includes(".") // skip file paths like sitemap.xml, robots.txt
  ) {
    const isValidProfile = (PROFILE_TYPES as readonly string[]).includes(
      profileSegment
    );
    if (!isValidProfile) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!supabase) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|files/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|xml|txt)$).*)",
  ],
};
