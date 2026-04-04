import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { PROFILE_TYPES } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Refresh Supabase auth session
  const supabase = createMiddlewareClient(request, response);
  await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Validate profile routes: /[profile]/*
  const profileSegment = pathname.split("/")[1];
  if (
    profileSegment &&
    !profileSegment.startsWith("_next") &&
    !profileSegment.startsWith("api") &&
    !profileSegment.startsWith("admin") &&
    !profileSegment.startsWith("images") &&
    profileSegment !== "favicon.ico"
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
